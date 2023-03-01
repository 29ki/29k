import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  RefreshControl,
  SectionList as RNSectionList,
  SectionListData,
  SectionListRenderItem,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import dayjs from 'dayjs';
import {useIsFocused, useNavigation} from '@react-navigation/native';

import useSessions from '../../../lib/sessions/hooks/useSessions';
import useCompletedSessions from '../../../lib/sessions/hooks/useCompletedSessions';

import {JourneyItem} from './types/JourneyItem';
import {CompletedSessionEvent} from '../../../../../shared/src/types/Event';
import {LiveSession} from '../../../../../shared/src/types/Session';

import {OverlayStackProps} from '../../../lib/navigation/constants/routes';
import {SPACINGS} from '../../../lib/constants/spacings';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {WALLET_CARD_HEIGHT} from '../../../lib/components/Cards/WalletCards/SessionWalletCard';
import {CARD_HEIGHT} from '../../../lib/components/Cards/Card';

import Gutters from '../../../lib/components/Gutters/Gutters';
import {
  Spacer16,
  Spacer24,
  Spacer48,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';

import Screen from '../../../lib/components/Screen/Screen';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import CompletedSessionCard from '../../../lib/components/Cards/SessionCard/CompletedSessionCard';
import SessionCard from '../../../lib/components/Cards/SessionCard/SessionCard';
import {Display24} from '../../../lib/components/Typography/Display/Display';

import StickyHeading from '../../../lib/components/StickyHeading/StickyHeading';
import TopBar from '../../../lib/components/TopBar/TopBar';
import MiniProfile from '../../../lib/components/MiniProfile/MiniProfile';
import useSavedCollections from '../../../lib/user/hooks/useSavedCollections';
import CollectionFullCard from '../../../lib/components/Cards/CollectionCards/CollectionFullCard';

export type Section = {
  title: string;
  data: JourneyItem[];
  type: 'planned' | 'completed' | 'collections';
};

const SectionList = RNSectionList<JourneyItem, Section>;

const Container = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
});

const renderSectionHeader: (info: {section: Section}) => React.ReactElement = ({
  section: {title},
}) => (
  <StickyHeading backgroundColor={COLORS.PURE_WHITE}>
    <Heading16>{title}</Heading16>
  </StickyHeading>
);

const renderSession: SectionListRenderItem<JourneyItem, Section> = ({
  section,
  item,
  index,
}) => {
  const hasCardBefore = index > 0;
  const hasCardAfter = index !== section.data.length - 1;

  if (item.completedSession) {
    return (
      <Gutters>
        <CompletedSessionCard
          completedSessionEvent={item.completedSession as CompletedSessionEvent}
          hasCardBefore={hasCardBefore}
          hasCardAfter={hasCardAfter}
        />
      </Gutters>
    );
  }

  if (item.savedCollection) {
    return (
      <Gutters>
        <CollectionFullCard collectionId={item.id} />
        <Spacer16 />
      </Gutters>
    );
  }

  return (
    <Gutters>
      <SessionCard
        session={item as LiveSession}
        standAlone={true}
        hasCardBefore={hasCardBefore}
        hasCardAfter={hasCardAfter}
      />
      <Spacer16 />
    </Gutters>
  );
};

const Journey = () => {
  const {t} = useTranslation('Screen.Journey');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<OverlayStackProps>>();
  const {fetchSessions, pinnedSessions, hostedSessions} = useSessions();
  const {completedSessions} = useCompletedSessions();
  const {savedCollections} = useSavedCollections();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const listRef = useRef<RNSectionList<JourneyItem, Section>>(null);

  const sections = useMemo(() => {
    let sectionsList: Section[] = [];

    if (completedSessions.length > 0) {
      sectionsList.push({
        title: t('headings.completed'),
        data: completedSessions.map(s => ({
          completedSession: s,
          id: s.payload.id,
        })),
        type: 'completed',
      });
    }

    if (savedCollections.length > 0) {
      sectionsList.push({
        title: t('headings.collections'),
        data: savedCollections.map(s => ({
          savedCollection: s,
          id: s.id,
        })),
        type: 'collections',
      });
    }

    if (hostedSessions.length > 0 || pinnedSessions.length > 0) {
      sectionsList.push({
        title: t('headings.planned'),
        data: [...hostedSessions, ...pinnedSessions].sort((a, b) =>
          dayjs(a.startTime).isBefore(dayjs(b.startTime)) ? -1 : 1,
        ),
        type: 'planned',
      });
    }

    return sectionsList;
  }, [pinnedSessions, hostedSessions, completedSessions, savedCollections, t]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const refreshPull = useCallback(async () => {
    try {
      setIsLoading(true);
      await fetchSessions();
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      throw e;
    }
  }, [setIsLoading, fetchSessions]);

  const getItemLayout = useCallback(
    (
      data: SectionListData<JourneyItem, Section>[] | null,
      index: number,
    ): {length: number; offset: number; index: number} => {
      let offset = 0,
        length = null,
        completedSessionsLength = data?.[0].data?.length || 0;

      if (index >= completedSessionsLength) {
        const plannedSessionsOffsetCount = index - completedSessionsLength;
        length = CARD_HEIGHT;
        offset += completedSessionsLength * WALLET_CARD_HEIGHT;
        offset += plannedSessionsOffsetCount * CARD_HEIGHT;
      } else {
        length = WALLET_CARD_HEIGHT;
        offset = index * WALLET_CARD_HEIGHT;
      }

      return {length, offset, index};
    },
    [],
  );

  useEffect(() => {
    if (isFocused && sections[1]?.data?.length && completedSessions.length) {
      requestAnimationFrame(() =>
        listRef.current?.scrollToLocation({
          itemIndex: 0,
          sectionIndex: 1,
          viewOffset: 380,
        }),
      );
    }
  }, [isFocused, completedSessions.length, sections]);

  const onPressEllipsis = useCallback(() => {
    navigate('AboutOverlay');
  }, [navigate]);

  if (!sections.length) {
    return (
      <Screen backgroundColor={COLORS.GREYLIGHTEST}>
        <TopSafeArea />
        <TopBar
          backgroundColor={COLORS.GREYLIGHTEST}
          onPressEllipsis={onPressEllipsis}>
          <MiniProfile />
        </TopBar>
        <Container>
          <Display24>{t('fallback')}</Display24>
        </Container>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={COLORS.PURE_WHITE}>
      <TopSafeArea minSize={SPACINGS.SIXTEEN} />
      <TopBar
        backgroundColor={COLORS.PURE_WHITE}
        onPressEllipsis={onPressEllipsis}>
        <MiniProfile />
      </TopBar>
      <SectionList
        ref={listRef}
        sections={sections}
        getItemLayout={getItemLayout}
        keyExtractor={session => session.id}
        ListHeaderComponent={Spacer24}
        ListFooterComponent={Spacer48}
        stickySectionHeadersEnabled
        renderSectionHeader={renderSectionHeader}
        renderItem={renderSession}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshPull} />
        }
      />
    </Screen>
  );
};

export default Journey;

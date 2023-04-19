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
import {partition, groupBy} from 'ramda';

import {JourneyItem} from './types/JourneyItem';
import {LiveSession} from '../../../../../shared/src/types/Session';

import {
  ModalStackProps,
  OverlayStackProps,
} from '../../../lib/navigation/constants/routes';
import {SPACINGS} from '../../../lib/constants/spacings';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {WALLET_CARD_HEIGHT} from '../../../lib/components/Cards/WalletCards/SessionWalletCard';
import {CARD_HEIGHT} from '../../../lib/components/Cards/Card';

import useSessions from '../../../lib/sessions/hooks/useSessions';
import useCompletedSessions from '../../../lib/sessions/hooks/useCompletedSessions';
import usePinnedCollections from '../../../lib/user/hooks/usePinnedCollections';
import useUserEvents from '../../../lib/user/hooks/useUserEvents';

import {
  Spacer16,
  Spacer24,
  Spacer48,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';
import Gutters from '../../../lib/components/Gutters/Gutters';
import Screen from '../../../lib/components/Screen/Screen';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import SessionCard from '../../../lib/components/Cards/SessionCard/SessionCard';
import {Display24} from '../../../lib/components/Typography/Display/Display';
import StickyHeading from '../../../lib/components/StickyHeading/StickyHeading';
import TopBar from '../../../lib/components/TopBar/TopBar';
import MiniProfile from '../../../lib/components/MiniProfile/MiniProfile';
import CollectionCardContainer from './components/CollectionCardContainer';
import BottomFade from '../../../lib/components/BottomFade/BottomFade';
import JourneyNode from './components/JourneyNode';
import {ThumbsUpWithoutPadding} from '../../../lib/components/Thumbs/Thumbs';
import FilterStatus from './components/FilterStatus';
import {LogoIcon} from '../../../lib/components/Icons';
import useUser from '../../../lib/user/hooks/useUser';
import Image from '../../../lib/components/Image/Image';

export type Section = {
  title: string;
  data: JourneyItem[];
  type: 'planned' | 'completed' | 'collections';
};

const SectionList = styled(RNSectionList<JourneyItem, Section>)({
  flex: 1,
});

const Container = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
});

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ImageContainer = styled.View<{small?: boolean}>(() => ({
  backgroundColor: COLORS.GREYMEDIUM,
  width: SPACINGS.TWENTYFOUR,
  height: SPACINGS.TWENTYFOUR,
  borderRadius: SPACINGS.TWELVE,
  overflow: 'hidden',
  shadowColor: COLORS.GREYDARK,
}));

const renderSectionHeader: (info: {section: Section}) => React.ReactElement = ({
  section: {title},
}) => (
  <StickyHeading backgroundColor={COLORS.PURE_WHITE}>
    <Heading16>{title}</Heading16>
  </StickyHeading>
);

const Journey = () => {
  const {t} = useTranslation('Screen.Journey');
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ModalStackProps>
    >();
  const {fetchSessions, pinnedSessions, hostedSessions} = useSessions();
  const {completedSessions, completedHostedSessions} = useCompletedSessions();
  const {pinnedCollections} = usePinnedCollections();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const listRef = useRef<RNSectionList<JourneyItem, Section>>(null);
  const {feedbackEvents} = useUserEvents();
  const user = useUser();

  const [positiveFeedbacks] = useMemo(
    () => partition(f => f.payload.answer, feedbackEvents),
    [feedbackEvents],
  );

  const sections = useMemo(() => {
    let sectionsList: Section[] = [];

    if (completedSessions.length > 0) {
      Object.entries(
        groupBy(
          item => dayjs(item.timestamp).format('MMM, YYYY'),
          completedSessions,
        ),
      ).forEach(([month, items]) => {
        sectionsList.push({
          title: month,
          data: items.map(s => ({
            completedSession: s,
            id: s.payload.id,
          })),
          type: 'completed',
        });
      });
    }

    if (pinnedCollections.length > 0) {
      sectionsList.push({
        title: t('headings.collections'),
        data: pinnedCollections.map(s => ({
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
  }, [pinnedSessions, hostedSessions, completedSessions, pinnedCollections, t]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const onPositivePress = useCallback(
    () => navigate('CompletedSessionsModal', {filterSetting: 'feedback'}),
    [navigate],
  );

  const onTotalPress = useCallback(
    () => navigate('CompletedSessionsModal', {filterSetting: 'mode'}),
    [navigate],
  );

  const onHostedPress = useCallback(
    () => navigate('CompletedSessionsModal', {filterSetting: 'host'}),
    [navigate],
  );

  const UserPic = useCallback(
    () => (
      <ImageContainer>
        {user?.photoURL && <Image source={{uri: user.photoURL}} />}
      </ImageContainer>
    ),
    [user],
  );

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
        completedSessionsLength = completedSessions.length ?? 0;

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
    [completedSessions],
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

  const renderSession = useCallback<
    SectionListRenderItem<JourneyItem, Section>
  >(
    ({section, item, index}) => {
      const hasCardBefore = index > 0;
      const hasCardAfter = index !== section.data.length - 1;

      if (item.completedSession) {
        const isLastItem =
          completedSessions.indexOf(item.completedSession) ===
          completedSessions.length - 1;

        return (
          <Gutters key={item.completedSession.payload.id}>
            <JourneyNode
              index={index}
              completedSessionEvent={item.completedSession}
              isLast={!hasCardAfter}
            />
            {item.completedSession && isLastItem && (
              <>
                <Row>
                  <FilterStatus
                    onPress={onTotalPress}
                    Icon={LogoIcon}
                    heading={`${completedSessions.length}`}
                    description={t('totalSessions')}
                  />
                  {positiveFeedbacks.length ? (
                    <>
                      <Spacer16 />
                      <FilterStatus
                        onPress={onPositivePress}
                        Icon={ThumbsUpWithoutPadding}
                        heading={`${positiveFeedbacks.length}`}
                        description={t('meaninfulSessions')}
                      />
                    </>
                  ) : null}
                  {completedHostedSessions.length ? (
                    <>
                      <Spacer16 />
                      <FilterStatus
                        onPress={onHostedPress}
                        Icon={UserPic}
                        heading={`${completedHostedSessions.length}`}
                        description={t('hostedSessions')}
                      />
                    </>
                  ) : null}
                </Row>
                <Spacer16 />
              </>
            )}
          </Gutters>
        );
      }

      if (item.savedCollection) {
        return (
          <Gutters>
            <CollectionCardContainer collectionId={item.id} />
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
    },
    [
      positiveFeedbacks.length,
      completedSessions,
      completedHostedSessions.length,
      onTotalPress,
      onHostedPress,
      onPositivePress,
      t,
      UserPic,
    ],
  );

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
        initialNumToRender={5}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshPull} />
        }
      />
      <Spacer16 />
      <BottomFade />
    </Screen>
  );
};

export default Journey;

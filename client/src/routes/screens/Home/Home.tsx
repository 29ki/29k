import {groupBy, takeLast} from 'ramda';
import dayjs from 'dayjs';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {RefreshControl, SectionList} from 'react-native';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation, useScrollToTop} from '@react-navigation/native';

import useSessions from '../../../lib/sessions/hooks/useSessions';

import {LiveSessionType} from '../../../../../shared/src/schemas/Session';

import {SPACINGS} from '../../../lib/constants/spacings';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {
  ModalStackProps,
  OverlayStackProps,
} from '../../../lib/navigation/constants/routes';
import SETTINGS from '../../../lib/constants/settings';
import {
  Spacer12,
  Spacer16,
  Spacer24,
  Spacer48,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';
import Gutters from '../../../lib/components/Gutters/Gutters';
import Button from '../../../lib/components/Buttons/Button';
import SessionCard from '../../../lib/components/Cards/SessionCard/SessionCard';
import {PlusIcon} from '../../../lib/components/Icons';
import Screen from '../../../lib/components/Screen/Screen';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import {SectionListRenderItem} from 'react-native';
import StickyHeading from '../../../lib/components/StickyHeading/StickyHeading';
import TopBar from '../../../lib/components/TopBar/TopBar';
import MiniProfile from '../../../lib/components/MiniProfile/MiniProfile';
import BottomFade from '../../../lib/components/BottomFade/BottomFade';
import useGetRelativeDateGroup from '../../../lib/date/hooks/useGetRelativeDateGroup';
import ComingSoonSlider from './components/ComingSoon';

export type ComingSoonHeading = {heading: string; description: string};
export type ComingSoonItem = {when: string; what: string};
export type ComingSoon = ComingSoonHeading & {
  id: 'coming-soon-section';
  items: ComingSoonItem[];
};

type Section = {
  title: string;
  data: (LiveSessionType | ComingSoon)[];
  type: 'hostedBy' | 'interested' | 'comming' | 'comingSoon';
  beyondThisWeek?: boolean;
};

const AddButton = styled(Button)({
  alignSelf: 'center',
  ...SETTINGS.BOXSHADOW,
});

const AddSessionWrapper = styled.View({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
});

const AddSessionForm = () => {
  const {t} = useTranslation('Screen.Home');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  return (
    <AddSessionWrapper>
      <AddButton
        onPress={() => navigate('CreateSessionModal', {exerciseId: undefined})}
        LeftIcon={PlusIcon}>
        {t('add')}
      </AddButton>
      <Spacer12 />
    </AddSessionWrapper>
  );
};

const renderSectionHeader: (info: {section: Section}) => React.ReactElement = ({
  section: {title},
}) => (
  <StickyHeading backgroundColor={COLORS.PURE_WHITE}>
    <Heading16>{title}</Heading16>
  </StickyHeading>
);

const renderSession = ({
  item,
  section,
  index,
}: {
  item: LiveSessionType;
  section: Section;
  index: number;
}) => {
  const standAlone = section.type === 'comming' || section.data.length === 1;
  const hasCardBefore = index > 0;
  const hasCardAfter = index !== section.data.length - 1;
  return (
    <Gutters>
      <SessionCard
        session={item}
        standAlone={standAlone}
        hasCardBefore={hasCardBefore}
        hasCardAfter={hasCardAfter}
      />
      {standAlone && <Spacer16 />}
    </Gutters>
  );
};

const renderListItem: SectionListRenderItem<
  ComingSoon | LiveSessionType,
  Section
> = ({item, section, index}) => {
  switch (section.type) {
    case 'comingSoon':
      return <ComingSoonSlider comingSoonSection={item as ComingSoon} />;
    default:
      return renderSession({item: item as LiveSessionType, section, index});
  }
};

const Home = () => {
  const {t} = useTranslation('Screen.Home');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<OverlayStackProps>>();
  const {fetchSessions, sessions, pinnedSessions, hostedSessions} =
    useSessions();
  const getRelativeDateGroup = useGetRelativeDateGroup();
  const listRef =
    useRef<SectionList<LiveSessionType | ComingSoon, Section>>(null);
  const [isLoading, setIsLoading] = useState(false);
  const comingSoon: ComingSoon = t('comingSoon', {returnObjects: true});

  useScrollToTop(listRef);

  const sections = useMemo(() => {
    let sectionsList: Section[] = [];
    let beyondThisWeek: Section[] = [];

    if (hostedSessions.length > 0) {
      sectionsList.push({
        title: t('sections.hostedBy'),
        data: hostedSessions,
        type: 'hostedBy',
      });
    }
    if (pinnedSessions.length > 0) {
      sectionsList.push({
        title: t('sections.interested'),
        data: pinnedSessions,
        type: 'interested',
      });
    }
    if (sessions.length > 0) {
      Object.entries(
        groupBy(
          session => getRelativeDateGroup(dayjs(session.startTime)),
          sessions,
        ),
      ).forEach(([group, items]) => {
        const isBeyondThisWeek =
          dayjs(takeLast(1, items)[0].startTime).isoWeek() !==
          dayjs().isoWeek();

        if (isBeyondThisWeek) {
          beyondThisWeek.push({
            title: group,
            data: items,
            type: 'comming',
          });
        } else {
          sectionsList.push({
            title: group,
            data: items,
            type: 'comming',
          });
        }
      });
    }

    if (comingSoon.items.length > 0) {
      sectionsList.push({
        title: t('sections.comingSoon'),
        data: [comingSoon],
        type: 'comingSoon',
      });
    }

    sectionsList.push(...beyondThisWeek);

    return sectionsList;
  }, [
    sessions,
    pinnedSessions,
    hostedSessions,
    t,
    getRelativeDateGroup,
    comingSoon,
  ]);

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

  const onPressEllipsis = useCallback(() => {
    navigate('AboutOverlay');
  }, [navigate]);

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
        keyExtractor={session => session.id}
        ListHeaderComponent={Spacer24}
        ListFooterComponent={Spacer48}
        stickySectionHeadersEnabled
        renderSectionHeader={renderSectionHeader}
        renderItem={renderListItem}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshPull} />
        }
      />
      <BottomFade />
      <AddSessionForm />
    </Screen>
  );
};

export default Home;

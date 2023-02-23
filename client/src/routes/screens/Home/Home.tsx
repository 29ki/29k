import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {RefreshControl, SectionList} from 'react-native';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import hexToRgba from 'hex-to-rgba';

import useSessions from '../../../lib/sessions/hooks/useSessions';

import {LiveSession} from '../../../../../shared/src/types/Session';

import {GUTTERS, SPACINGS} from '../../../lib/constants/spacings';
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
  Spacer8,
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

type Section = {
  title: string;
  data: LiveSession[];
  type: 'hostedBy' | 'interested' | 'comming';
};

const AddButton = styled(Button)({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const AddSessionWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
  ...SETTINGS.BOXSHADOW,
});

const FloatingForm = styled(LinearGradient).attrs({
  colors: [hexToRgba(COLORS.WHITE, 0), hexToRgba(COLORS.WHITE, 1)],
})({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  paddingHorizontal: GUTTERS.BIG,
  paddingTop: SPACINGS.TWENTYFOUR,
  passingBottom: SPACINGS.TWELVE,
  zIndex: 2,
});

const AddSessionForm = () => {
  const {t} = useTranslation('Screen.Sessions');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  return (
    <AddSessionWrapper>
      <AddButton
        onPress={() => navigate('CreateSessionModal', {exerciseId: undefined})}
        LeftIcon={PlusIcon}>
        {t('add')}
      </AddButton>
      <Spacer8 />
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

const renderSession: SectionListRenderItem<LiveSession, Section> = ({
  item,
  section,
  index,
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

const Home = () => {
  const {t} = useTranslation('Screen.Sessions');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<OverlayStackProps>>();
  const {fetchSessions, sessions, pinnedSessions, hostedSessions} =
    useSessions();
  const [isLoading, setIsLoading] = useState(false);

  const sections = useMemo(() => {
    let sectionsList: Section[] = [];
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
      sectionsList.push({
        title: t('sections.comming'),
        data: sessions,
        type: 'comming',
      });
    }
    return sectionsList;
  }, [sessions, pinnedSessions, hostedSessions, t]);

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
        sections={sections}
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

      <FloatingForm>
        <AddSessionForm />
        <Spacer12 />
      </FloatingForm>
    </Screen>
  );
};

export default Home;

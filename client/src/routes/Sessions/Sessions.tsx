import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ListRenderItemInfo, RefreshControl, SectionList} from 'react-native';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import useSessions from './hooks/useSessions';

import {Session} from '../../../../shared/src/types/Session';

import {GUTTERS, SPACINGS} from '../../common/constants/spacings';
import {COLORS} from '../../../../shared/src/constants/colors';
import {ModalStackProps} from '../../lib/navigation/constants/routes';
import SETTINGS from '../../common/constants/settings';
import {
  Spacer12,
  Spacer16,
  Spacer24,
  Spacer60,
  Spacer8,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import Gutters from '../../common/components/Gutters/Gutters';
import Button from '../../common/components/Buttons/Button';
import SessionCard from '../../common/components/Cards/SessionCard/SessionCard';
import {PlusIcon} from '../../common/components/Icons';
import Screen from '../../common/components/Screen/Screen';
import {Heading18} from '../../common/components/Typography/Heading/Heading';

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
  colors: ['rgba(249, 248, 244, 0)', 'rgba(249, 248, 244, 1)'],
})({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  paddingHorizontal: GUTTERS.BIG,
  paddingTop: SPACINGS.TWENTYFOUR,
  passingBottom: SPACINGS.TWELVE,
});

const ListHeader = () => (
  <>
    <TopSafeArea />
    <Spacer16 />
  </>
);

const AddSessionForm = () => {
  const {t} = useTranslation('Screen.Sessions');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  return (
    <AddSessionWrapper>
      <AddButton
        onPress={() => navigate('AddSessionModal')}
        LeftIcon={PlusIcon}>
        {t('add')}
      </AddButton>
      <Spacer8 />
    </AddSessionWrapper>
  );
};

const Sessions = () => {
  const {t} = useTranslation('Screen.Sessions');
  const {fetchSessions, sessions, pinnedSessions} = useSessions();
  const [isLoading, setIsLoading] = useState(false);

  const sections = useMemo(() => {
    let sectionsList = [];
    if (pinnedSessions.length > 0) {
      sectionsList.push({
        title: t('interested'),
        data: pinnedSessions,
        type: 'interested',
      });
    }
    if (sessions.length > 0) {
      sectionsList.push({
        title: t('commingSessions'),
        data: sessions,
        type: 'comming',
      });
    }
    return sectionsList;
  }, [sessions, pinnedSessions, t]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const refreshPull = useCallback(async () => {
    setIsLoading(true);
    await fetchSessions();
    setIsLoading(false);
  }, [setIsLoading, fetchSessions]);

  const renderSession = ({item}: ListRenderItemInfo<Session>) => (
    <Gutters>
      <SessionCard session={item} />
    </Gutters>
  );

  return (
    <Screen backgroundColor={COLORS.PURE_WHITE}>
      <SectionList
        sections={sections}
        keyExtractor={session => session.id}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={Spacer60}
        ItemSeparatorComponent={Spacer16}
        renderItem={renderSession}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshPull} />
        }
        renderSectionHeader={({section: {title, type}}) => (
          <Gutters>
            {sections.length === 2 && type === 'comming' && <Spacer24 />}
            <Heading18>{title}</Heading18>
            <Spacer8 />
          </Gutters>
        )}
      />

      <FloatingForm>
        <AddSessionForm />
        <Spacer12 />
      </FloatingForm>
    </Screen>
  );
};

export default Sessions;

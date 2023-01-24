import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ListRenderItemInfo, RefreshControl, SectionList} from 'react-native';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import useSessions from '../../lib/sessions/hooks/useSessions';

import {Session} from '../../../../shared/src/types/Session';

import {GUTTERS, SPACINGS} from '../../lib/constants/spacings';
import {COLORS} from '../../../../shared/src/constants/colors';
import {ModalStackProps} from '../../lib/navigation/constants/routes';
import SETTINGS from '../../lib/constants/settings';
import {
  Spacer12,
  Spacer16,
  Spacer24,
  Spacer60,
  Spacer8,
  TopSafeArea,
} from '../../lib/components/Spacers/Spacer';
import Gutters from '../../lib/components/Gutters/Gutters';
import Button from '../../lib/components/Buttons/Button';
import SessionCard from '../../lib/components/Cards/SessionCard/SessionCard';
import {PlusIcon} from '../../lib/components/Icons';
import Screen from '../../lib/components/Screen/Screen';
import {Heading18} from '../../lib/components/Typography/Heading/Heading';
import useCompletedSessions from '../../lib/sessions/hooks/useCompletedSessions';
import {Body16} from '../../lib/components/Typography/Body/Body';

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

const Plan = () => {
  // const {t} = useTranslation('Screen.Plan');
  const {fetchSessions, pinnedSessions, hostedSessions} = useSessions();
  const {completedSessions} = useCompletedSessions();
  const [isLoading, setIsLoading] = useState(false);

  const sections = useMemo(() => {
    let sectionsList = [];

    if (completedSessions.length > 0) {
      sectionsList.push({
        title: 'Completed',
        data: completedSessions,
        type: 'completed',
      });
    }

    if (hostedSessions.length > 0 || pinnedSessions.length > 0) {
      sectionsList.push({
        title: 'Upcoming',
        data: [...pinnedSessions, ...hostedSessions],
      });
    }

    return sectionsList;
  }, [pinnedSessions, hostedSessions, completedSessions]);

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

  const renderSession = ({item}: ListRenderItemInfo<Session>) => (
    <Gutters>
      <Body16>- {item.id}</Body16>
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
            {sections[0].type !== type && <Spacer24 />}
            <Heading18>{title}</Heading18>
            <Spacer8 />
          </Gutters>
        )}
      />
    </Screen>
  );
};

export default Plan;

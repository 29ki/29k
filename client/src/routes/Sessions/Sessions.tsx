import React, {useEffect} from 'react';
import {ListRenderItemInfo, RefreshControl} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import {useRecoilValue} from 'recoil';
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
  Spacer60,
  Spacer8,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import Gutters from '../../common/components/Gutters/Gutters';
import Button from '../../common/components/Buttons/Button';
import SessionCard from '../../common/components/Cards/SessionCard/SessionCard';
import {PlusIcon} from '../../common/components/Icons';
import {isLoadingAtom, sessionsAtom} from './state/state';
import Screen from '../../common/components/Screen/Screen';
import useIsPublicHost from '../../lib/user/hooks/useIsPublicHost';

const CreateButton = styled(Button)({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const CreateSessionWrapper = styled.View({
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

const CreateSessionForm = ({allowCreate}: {allowCreate: Boolean}) => {
  const {t} = useTranslation('Screen.Sessions');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  return (
    <CreateSessionWrapper>
      {allowCreate && (
        <>
          <CreateButton
            onPress={() => navigate('CreateSessionModal')}
            LeftIcon={PlusIcon}>
            {t('create')}
          </CreateButton>
          <Spacer8 />
        </>
      )}

      <CreateButton
        onPress={() => navigate('JoinSessionModal', {inviteCode: undefined})}
        LeftIcon={PlusIcon}>
        {t('join')}
      </CreateButton>
    </CreateSessionWrapper>
  );
};

const Sessions = () => {
  const {fetchSessions} = useSessions();
  const isLoading = useRecoilValue(isLoadingAtom);
  const sessions = useRecoilValue(sessionsAtom);
  const {isPublicHost} = useIsPublicHost();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const renderSession = ({item}: ListRenderItemInfo<Session>) => (
    <Gutters>
      <SessionCard session={item} />
    </Gutters>
  );

  return (
    <Screen backgroundColor={COLORS.PURE_WHITE}>
      <FlatList
        data={sessions}
        keyExtractor={session => session.id}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={Spacer60}
        ItemSeparatorComponent={Spacer16}
        renderItem={renderSession}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchSessions} />
        }
      />

      <FloatingForm>
        <CreateSessionForm allowCreate={isPublicHost} />
        <Spacer12 />
      </FloatingForm>
    </Screen>
  );
};

export default Sessions;

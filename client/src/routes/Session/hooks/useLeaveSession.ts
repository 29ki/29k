import {useCallback, useContext} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {DailyContext} from '../../../lib/daily/DailyProvider';
import useSessionState from '../state/state';
import {TabNavigatorProps} from '../../../lib/navigation/constants/routes';
import useSessions from '../../Sessions/hooks/useSessions';
import useSessionNotificationsState from '../state/sessionNotificationsState';
import useLogSessionMetricEvents from './useLogSessionMetricEvents';

type ScreenNavigationProps = NativeStackNavigationProp<TabNavigatorProps>;

const useLeaveSession = () => {
  const {t} = useTranslation('Component.ConfirmExitSession');
  const {leaveMeeting} = useContext(DailyContext);
  const {navigate} = useNavigation<ScreenNavigationProps>();
  const {fetchSessions} = useSessions();
  const {logLeaveSessionMetricEvent} = useLogSessionMetricEvents();

  const resetSession = useSessionState(state => state.reset);
  const resetSessionNotifications = useSessionNotificationsState(
    state => state.reset,
  );

  const leaveSession = useCallback(async () => {
    await leaveMeeting();
    resetSession();
    resetSessionNotifications();

    fetchSessions();
    navigate('Sessions');
  }, [
    leaveMeeting,
    resetSession,
    resetSessionNotifications,
    navigate,
    fetchSessions,
  ]);

  const leaveSessionWithConfirm = useCallback(
    () =>
      Alert.alert(t('header'), t('text'), [
        {
          text: t('buttons.cancel'),
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: t('buttons.confirm'),
          style: 'destructive',

          onPress: () => {
            leaveSession();
            logLeaveSessionMetricEvent();
          },
        },
      ]),
    [t, leaveSession, logLeaveSessionMetricEvent],
  );

  return {leaveSession, leaveSessionWithConfirm};
};

export default useLeaveSession;

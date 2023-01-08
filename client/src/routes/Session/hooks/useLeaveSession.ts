import {useCallback, useContext} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {DailyContext} from '../../../lib/daily/DailyProvider';
import useSessionState from '../state/state';
import {
  ModalStackProps,
  TabNavigatorProps,
} from '../../../lib/navigation/constants/routes';
import useSessions from '../../../lib/sessions/hooks/useSessions';
import useSessionNotificationsState from '../state/sessionNotificationsState';
import useLogInSessionMetricEvents from './useLogInSessionMetricEvents';

type ScreenNavigationProps = NativeStackNavigationProp<
  TabNavigatorProps & ModalStackProps
>;

const useLeaveSession = () => {
  const {t} = useTranslation('Component.ConfirmExitSession');
  const {leaveMeeting} = useContext(DailyContext);
  const {navigate} = useNavigation<ScreenNavigationProps>();
  const session = useSessionState(state => state.session);
  const {fetchSessions} = useSessions();
  const logSessionMetricEvent = useLogInSessionMetricEvents();

  const resetSession = useSessionState(state => state.reset);
  const resetSessionNotifications = useSessionNotificationsState(
    state => state.reset,
  );

  const leaveSession = useCallback(async () => {
    const sessionId = session?.id ?? '';
    const completed = session?.ended ?? true;

    await leaveMeeting();
    resetSession();
    resetSessionNotifications();

    fetchSessions();

    navigate('Sessions');
    navigate('SessionFeedbackModal', {sessionId, completed});
  }, [
    session?.id,
    session?.ended,
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
            if (!session?.exerciseState?.completed) {
              logSessionMetricEvent('Leave Sharing Session');
            }
          },
        },
      ]),
    [t, leaveSession, session?.exerciseState?.completed, logSessionMetricEvent],
  );

  return {leaveSession, leaveSessionWithConfirm};
};

export default useLeaveSession;

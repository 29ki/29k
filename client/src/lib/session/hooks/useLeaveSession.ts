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
import useLiveSessionMetricEvents from './useLiveSessionMetricEvents';
import useIsSessionHost from './useIsSessionHost';
import {SessionMode} from '../../../../../shared/src/types/Session';
import useAsyncSessionMetricEvents from './useAsyncSessionMetricEvents';

type ScreenNavigationProps = NativeStackNavigationProp<
  TabNavigatorProps & ModalStackProps
>;

const useLeaveSession = (sessionMode: SessionMode) => {
  const {t} = useTranslation('Component.ConfirmExitSession');
  const {leaveMeeting} = useContext(DailyContext);
  const {navigate} = useNavigation<ScreenNavigationProps>();
  const session = useSessionState(state => state.session);
  const sessionState = useSessionState(state => state.sessionState);
  const asyncSession = useSessionState(state => state.asyncSession);
  const isHost = useIsSessionHost();
  const {fetchSessions} = useSessions();
  const logLiveSessionMetricEvent = useLiveSessionMetricEvents();
  const logAsyncSessionMetricEvent = useAsyncSessionMetricEvents();

  const resetSession = useSessionState(state => state.reset);

  const leaveSession = useCallback(async () => {
    if (sessionMode !== 'async') {
      await leaveMeeting();
    }

    resetSession();

    fetchSessions();

    navigate('Sessions');

    if (
      session?.id &&
      sessionState?.started &&
      sessionMode !== SessionMode.async
    ) {
      navigate('SessionFeedbackModal', {
        exerciseId: session.exerciseId,
        sessionId: session.id,
        completed: Boolean(sessionState?.completed),
        isHost,
      });
    } else if (
      sessionState?.completed &&
      sessionMode === SessionMode.async &&
      asyncSession
    ) {
      navigate('AsyncSessionModal', {
        session: asyncSession,
      });
    }
  }, [
    sessionMode,
    asyncSession,
    session?.id,
    session?.exerciseId,
    sessionState?.started,
    sessionState?.completed,
    isHost,
    leaveMeeting,
    resetSession,
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
            if (!sessionState?.completed) {
              if (sessionMode === 'async') {
                logAsyncSessionMetricEvent('Leave Sharing Session');
              } else {
                logLiveSessionMetricEvent('Leave Sharing Session');
              }
            }
          },
        },
      ]),
    [
      sessionMode,
      t,
      leaveSession,
      sessionState?.completed,
      logLiveSessionMetricEvent,
      logAsyncSessionMetricEvent,
    ],
  );

  return {leaveSession, leaveSessionWithConfirm};
};

export default useLeaveSession;

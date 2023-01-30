import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useCallback} from 'react';
import {
  AsyncSessionStackProps,
  ModalStackProps,
  TabNavigatorProps,
} from '../../lib/navigation/constants/routes';
import useLeaveSession from '../../lib/session/hooks/useLeaveSession';
import usePreventGoingBack from '../../lib/navigation/hooks/usePreventGoingBack';
import IntroPortalComponent from '../../lib/session/components/IntroPortal/IntroPortal';
import useUpdateAsyncSessionState from '../../lib/session/hooks/useUpdateAsyncSessionState';
import useExerciseById from '../../lib/content/hooks/useExerciseById';
import useLogInSessionMetricEvents from '../../lib/session/hooks/useLogInSessionMetricEvents';

const IntroPortal: React.FC = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<AsyncSessionStackProps, 'IntroPortal'>>();

  const exercise = useExerciseById(session.contentId);
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<
        AsyncSessionStackProps & TabNavigatorProps & ModalStackProps
      >
    >();
  const {startSession} = useUpdateAsyncSessionState(session);
  const {leaveSessionWithConfirm} = useLeaveSession(session.type);
  const isFocused = useIsFocused();
  const {logAsyncSessionMetricEvent} = useLogInSessionMetricEvents();

  usePreventGoingBack(leaveSessionWithConfirm);

  useEffect(() => {
    logAsyncSessionMetricEvent('Enter Intro Portal');
  }, [logAsyncSessionMetricEvent]);

  const onStartSession = useCallback(() => {
    startSession();
    logAsyncSessionMetricEvent('Start Sharing Session');
  }, [startSession, logAsyncSessionMetricEvent]);

  const navigateToSession = useCallback(
    () => navigate('Session', {session}),
    [navigate, session],
  );

  return (
    <IntroPortalComponent
      exercise={exercise}
      isFocused={isFocused}
      isHost={true}
      onStartSession={onStartSession}
      onLeaveSession={leaveSessionWithConfirm}
      onNavigateToSession={navigateToSession}
    />
  );
};

export default IntroPortal;

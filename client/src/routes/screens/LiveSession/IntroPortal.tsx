import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useCallback} from 'react';

import {
  ModalStackProps,
  LiveSessionStackProps,
  TabNavigatorProps,
} from '../../../lib/navigation/constants/routes';

import useLeaveSession from '../../../lib/session/hooks/useLeaveSession';
import useIsSessionHost from '../../../lib/session/hooks/useIsSessionHost';
import useUpdateSessionState from '../../../lib/session/hooks/useUpdateSessionState';
import useSubscribeToSessionIfFocused from '../../../lib/session/hooks/useSubscribeToSessionIfFocused';
import IntroPortalComponent from '../../../lib/session/components/IntroPortal/IntroPortal';
import PortalStatus from '../../../lib/session/components/PortalStatus/PortalStatus';
import useLiveSessionMetricEvents from '../../../lib/session/hooks/useLiveSessionMetricEvents';
import useSessionState from '../../../lib/session/state/state';
import useHandleLeaveLiveSession from '../../../lib/session/hooks/useHandleLeaveLiveSession';
import useConfirmLogMindfulMinutes from '../../../lib/mindfulMinutes/hooks/useConfirmLogMindfulMinutes';

const IntroPortal: React.FC = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<LiveSessionStackProps, 'IntroPortal'>>();

  const exercise = useSessionState(state => state.exercise);
  const isHost = useIsSessionHost();
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<
        LiveSessionStackProps & TabNavigatorProps & ModalStackProps
      >
    >();
  const {startSession} = useUpdateSessionState(session.id);
  const {leaveSessionWithConfirm} = useLeaveSession(session);
  const isFocused = useIsFocused();
  const logSessionMetricEvent = useLiveSessionMetricEvents();
  const confirmLogMindfulMinutes = useConfirmLogMindfulMinutes();
  useSubscribeToSessionIfFocused(session);

  useHandleLeaveLiveSession(session);

  useEffect(() => {
    logSessionMetricEvent('Enter Intro Portal');
    confirmLogMindfulMinutes();
  }, [logSessionMetricEvent, confirmLogMindfulMinutes]);

  const onStartSession = useCallback(() => {
    startSession();
    logSessionMetricEvent('Start Sharing Session');
  }, [startSession, logSessionMetricEvent]);

  const navigateToSession = useCallback(
    () => navigate('Session', {session}),
    [navigate, session],
  );

  return (
    <IntroPortalComponent
      exercise={exercise}
      isFocused={isFocused}
      isHost={isHost}
      isLive
      onStartSession={onStartSession}
      onLeaveSession={leaveSessionWithConfirm}
      onNavigateToSession={navigateToSession}
      statusComponent={<PortalStatus />}
    />
  );
};

export default IntroPortal;

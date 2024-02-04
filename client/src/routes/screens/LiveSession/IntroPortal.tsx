import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useCallback, useState} from 'react';

import {LiveSessionStackProps} from '../../../lib/navigation/constants/routes';

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
  const navigation =
    useNavigation<NativeStackNavigationProp<LiveSessionStackProps>>();

  const exercise = useSessionState(state => state.exercise);
  const isHost = useIsSessionHost();
  const {startSession} = useUpdateSessionState(session.id);
  const {leaveSessionWithConfirm} = useLeaveSession(session);
  const [isVisible, setIsVisible] = useState(true);
  const logSessionMetricEvent = useLiveSessionMetricEvents();
  const confirmLogMindfulMinutes = useConfirmLogMindfulMinutes();
  useSubscribeToSessionIfFocused(session);

  useHandleLeaveLiveSession(session);

  useEffect(
    () =>
      navigation.addListener('transitionEnd', ({data}) => {
        setIsVisible(data.closing === false);
      }),
    [navigation],
  );

  useEffect(() => {
    logSessionMetricEvent('Enter Intro Portal');
    confirmLogMindfulMinutes();
  }, [logSessionMetricEvent, confirmLogMindfulMinutes]);

  const onStartSession = useCallback(() => {
    startSession();
    logSessionMetricEvent('Start Sharing Session');
  }, [startSession, logSessionMetricEvent]);

  const navigateToSession = useCallback(
    () => navigation.navigate('Session', {session}),
    [navigation, session],
  );

  return (
    <IntroPortalComponent
      exercise={exercise}
      isVisible={isVisible}
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

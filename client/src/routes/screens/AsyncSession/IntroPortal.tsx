import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useCallback, useState} from 'react';
import {AsyncSessionStackProps} from '../../../lib/navigation/constants/routes';
import useLeaveSession from '../../../lib/session/hooks/useLeaveSession';
import usePreventGoingBack from '../../../lib/navigation/hooks/usePreventGoingBack';
import IntroPortalComponent from '../../../lib/session/components/IntroPortal/IntroPortal';
import useUpdateAsyncSessionState from '../../../lib/session/hooks/useUpdateAsyncSessionState';
import useAsyncSessionMetricEvents from '../../../lib/session/hooks/useAsyncSessionMetricEvents';
import useSessionState from '../../../lib/session/state/state';
import useConfirmLogMindfulMinutes from '../../../lib/mindfulMinutes/hooks/useConfirmLogMindfulMinutes';
import {AsyncSessionType} from '../../../../../shared/src/schemas/Session';

const IntroPortal: React.FC<{session?: AsyncSessionType}> = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<AsyncSessionStackProps, 'IntroPortal'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<AsyncSessionStackProps>>();

  const exercise = useSessionState(state => state.exercise);
  const {startSession} = useUpdateAsyncSessionState(session);
  const {leaveSessionWithConfirm} = useLeaveSession(session);
  const [isVisible, setIsVisible] = useState(true);
  const logSessionMetricEvent = useAsyncSessionMetricEvents();
  const confirmLogMindfulMinutes = useConfirmLogMindfulMinutes();

  usePreventGoingBack(leaveSessionWithConfirm);

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
      isHost={true}
      hideHostNotes={true}
      onStartSession={onStartSession}
      onLeaveSession={leaveSessionWithConfirm}
      onNavigateToSession={navigateToSession}
    />
  );
};

export default IntroPortal;

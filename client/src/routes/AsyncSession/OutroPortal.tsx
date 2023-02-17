import React, {useEffect} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';

import useLeaveSession from '../../lib/session/hooks/useLeaveSession';
import useAsyncSessionMetricEvents from '../../lib/session/hooks/useAsyncSessionMetricEvents';

import OutroPortalComponent from '../../lib/session/components/OutroPortal/OutroPortal';
import {AsyncSessionStackProps} from '../../lib/navigation/constants/routes';
import useSessionExercise from '../../lib/session/hooks/useSessionExercise';

const OutroPortal: React.FC = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<AsyncSessionStackProps, 'OutroPortal'>>();
  const exercise = useSessionExercise();
  const {leaveSession} = useLeaveSession(session.mode);
  const logSessionMetricEvent = useAsyncSessionMetricEvents();

  const outroPortal = exercise?.outroPortal;
  const introPortal = exercise?.introPortal;

  useEffect(() => {
    logSessionMetricEvent('Enter Outro Portal');
  }, [logSessionMetricEvent]);

  useEffect(() => {
    if (
      !outroPortal?.video &&
      (!introPortal?.videoEnd || !introPortal?.videoLoop)
    ) {
      leaveSession();
    }
  }, [
    introPortal?.videoEnd,
    introPortal?.videoLoop,
    outroPortal?.video,
    leaveSession,
  ]);

  return (
    <OutroPortalComponent onLeaveSession={leaveSession} exercise={exercise} />
  );
};

export default OutroPortal;

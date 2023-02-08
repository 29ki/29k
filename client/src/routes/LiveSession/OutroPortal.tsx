import React, {useEffect} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';

import useLeaveSession from '../../lib/session/hooks/useLeaveSession';
import useExerciseById from '../../lib/content/hooks/useExerciseById';
import useLiveSessionMetricEvents from '../../lib/session/hooks/useLiveSessionMetricEvents';

import OutroPortalComponent from '../../lib/session/components/OutroPortal/OutroPortal';
import {LiveSessionStackProps} from '../../lib/navigation/constants/routes';

const OutroPortal: React.FC = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<LiveSessionStackProps, 'OutroPortal'>>();
  const exercise = useExerciseById(session.exerciseId);
  const {leaveSession} = useLeaveSession(session.mode);
  const logSessionMetricEvent = useLiveSessionMetricEvents();

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

import React, {useCallback, useEffect} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';

import useLeaveSession from '../../../lib/session/hooks/useLeaveSession';
import useAsyncSessionMetricEvents from '../../../lib/session/hooks/useAsyncSessionMetricEvents';

import OutroPortalComponent from '../../../lib/session/components/OutroPortal/OutroPortal';
import {AsyncSessionStackProps} from '../../../lib/navigation/constants/routes';
import useSessionState from '../../../lib/session/state/state';
import Screen from '../../../lib/components/Screen/Screen';
import {StatusBar} from 'react-native';
import {
  BottomSafeArea,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';
import {SPACINGS} from '../../../lib/constants/spacings';

const OutroPortal: React.FC = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<AsyncSessionStackProps, 'OutroPortal'>>();
  const exercise = useSessionState(state => state.exercise);
  const {leaveSession} = useLeaveSession(session);
  const logSessionMetricEvent = useAsyncSessionMetricEvents();

  const outroPortal = exercise?.outroPortal;
  const introPortal = exercise?.introPortal;

  useEffect(() => {
    logSessionMetricEvent('Enter Outro Portal');
  }, [logSessionMetricEvent]);

  useEffect(() => {
    if (
      !outroPortal?.video &&
      !introPortal?.videoEnd &&
      !introPortal?.videoLoop
    ) {
      leaveSession();
    }
  }, [
    introPortal?.videoEnd,
    introPortal?.videoLoop,
    outroPortal?.video,
    leaveSession,
  ]);

  const onLeaveSession = useCallback(() => {
    leaveSession();
  }, [leaveSession]);

  return (
    <Screen backgroundColor={exercise?.theme?.backgroundColor}>
      <StatusBar hidden />
      <TopSafeArea minSize={SPACINGS.SIXTEEN} />
      <OutroPortalComponent
        onLeaveSession={onLeaveSession}
        exercise={exercise}
      />
      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </Screen>
  );
};

export default OutroPortal;

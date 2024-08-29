import React, {useCallback} from 'react';
import IntroPortalComponent from '../../../lib/session/components/IntroPortal/IntroPortal';
import useUpdateAsyncSessionState from '../../../lib/session/hooks/useUpdateAsyncSessionState';
import useSessionState from '../../../lib/session/state/state';
import {AsyncSessionType} from '../../../../../shared/src/schemas/Session';

const IntroPortal = ({session}: {session: AsyncSessionType}) => {
  const exercise = useSessionState(state => state.exercise);
  const {startSession} = useUpdateAsyncSessionState(session);

  const onStartSession = useCallback(() => {
    startSession();
  }, [startSession]);

  const navigateToSession = useCallback(() => {}, []);

  const onLeaveSession = useCallback(() => {}, []);

  return (
    <IntroPortalComponent
      exercise={exercise}
      isVisible={true}
      isHost={true}
      hideHostNotes={true}
      onStartSession={onStartSession}
      onLeaveSession={onLeaveSession}
      onNavigateToSession={navigateToSession}
    />
  );
};

export default IntroPortal;

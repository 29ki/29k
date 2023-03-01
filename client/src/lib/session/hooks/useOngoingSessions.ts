import {partition} from 'ramda';
import {useCallback} from 'react';
import {LiveSession} from '../../../../../shared/src/types/Session';

import {getSession} from '../../sessions/api/session';
import useUserEvents from '../../user/hooks/useUserEvents';
import useUserState from '../../user/state/state';

const useOngoingSessions = () => {
  const addUserEvent = useUserState(state => state.addUserEvent);
  const removeUserEvent = useUserState(state => state.removeUserEvent);
  const {ongoingSessionEvents} = useUserEvents();

  const addOngoingSession = useCallback(
    async (sessionId: LiveSession['id']) => {
      if (ongoingSessionEvents.find(e => e.payload.id === sessionId)) {
        return;
      }

      addUserEvent('ongoingSession', {
        id: sessionId,
      });
    },
    [addUserEvent, ongoingSessionEvents],
  );

  const getOngoingSessions = useCallback(async () => {
    const sessions = await Promise.all(
      ongoingSessionEvents.map(event => getSession(event.payload.id)),
    );

    const [ongoingSessions, endedSessions] = partition(s => !s.ended, sessions);

    endedSessions.forEach(s => {
      removeUserEvent(
        e => e.type === 'ongoingSession' && e.payload.id === s.id,
      );
    });

    return ongoingSessions;
  }, [ongoingSessionEvents, removeUserEvent]);

  return {
    getOngoingSessions,
    addOngoingSession,
  };
};

export default useOngoingSessions;

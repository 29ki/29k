import {useMemo} from 'react';
import useUserEvents from './useUserEvents';

const useCompletedSessionById = (sessionId?: string) => {
  const {completedSessionEvents} = useUserEvents();

  return useMemo(() => {
    if (sessionId && completedSessionEvents) {
      return completedSessionEvents.find(cs => cs.payload.id === sessionId);
    }
  }, [sessionId, completedSessionEvents]);
};

export default useCompletedSessionById;

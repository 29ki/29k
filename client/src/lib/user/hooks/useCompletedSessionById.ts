import {useMemo} from 'react';
import useUserState, {getCurrentUserStateSelector} from '../state/state';

const useCompletedSessionById = (sessionId?: string) => {
  const completedSessions = useUserState(state =>
    getCurrentUserStateSelector(state),
  )?.completedSessions;

  return useMemo(() => {
    if (sessionId && completedSessions) {
      return completedSessions.find(cs => cs.id === sessionId);
    }
  }, [sessionId, completedSessions]);
};

export default useCompletedSessionById;

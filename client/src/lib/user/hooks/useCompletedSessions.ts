import {useMemo} from 'react';

import useUserEvents from './useUserEvents';
import useUser from './useUser';

const useCompletedSessions = () => {
  const {completedSessionEvents} = useUserEvents();
  const user = useUser();

  const completedSessions = useMemo(
    () =>
      completedSessionEvents.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      ),
    [completedSessionEvents],
  );

  const completedHostedSessions = useMemo(
    () =>
      completedSessions.filter(({payload: {hostId}}) => hostId === user?.uid),
    [completedSessions, user?.uid],
  );

  return {
    completedSessions,
    completedHostedSessions,
  };
};

export default useCompletedSessions;

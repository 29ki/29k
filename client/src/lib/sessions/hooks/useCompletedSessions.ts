import {useMemo} from 'react';

import useUserEvents from '../../user/hooks/useUserEvents';

const useCompletedSessions = () => {
  const {completedSessionEvents} = useUserEvents();

  const completedSessions = useMemo(
    () =>
      completedSessionEvents.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      ),
    [completedSessionEvents],
  );

  return {
    completedSessions,
  };
};

export default useCompletedSessions;

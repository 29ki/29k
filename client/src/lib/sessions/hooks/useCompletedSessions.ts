import {useMemo} from 'react';

import useCurrentUserState from '../../user/hooks/useCurrentUserState';

const useCompletedSessions = () => {
  const userState = useCurrentUserState();

  const completedSessions = useMemo(
    () => userState?.completedSessions ?? [],
    [userState],
  );

  return {
    completedSessions,
  };
};

export default useCompletedSessions;

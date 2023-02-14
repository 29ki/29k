import {useMemo} from 'react';

import useCurrentUserState from '../../user/hooks/useCurrentUserState';

const usePinnedSessions = () => {
  const userState = useCurrentUserState();

  const pinnedSessions = useMemo(
    () => userState?.pinnedSessions ?? [],
    [userState?.pinnedSessions],
  );

  return pinnedSessions;
};

export default usePinnedSessions;

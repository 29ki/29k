import {useMemo} from 'react';

import useCurrentUserState from './useCurrentUserState';

const usePinnedCollections = () => {
  const userState = useCurrentUserState();

  const pinnedCollections = useMemo(
    () => userState?.pinnedCollection ?? [],
    [userState?.pinnedCollection],
  );

  return {pinnedCollections};
};

export default usePinnedCollections;

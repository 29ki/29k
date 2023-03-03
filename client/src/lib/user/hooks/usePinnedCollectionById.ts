import {useMemo} from 'react';

import useCurrentUserState from './useCurrentUserState';

const usePinnedCollectionById = (collectionId?: string) => {
  const userState = useCurrentUserState();

  return useMemo(
    () => userState?.pinnedCollection?.find(sc => sc.id === collectionId),
    [userState?.pinnedCollection, collectionId],
  );
};

export default usePinnedCollectionById;

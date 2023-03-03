import {useMemo} from 'react';

import useCurrentUserState from './useCurrentUserState';

const usePinnedCollectionById = (collectionId?: string) => {
  const userState = useCurrentUserState();

  return useMemo(
    () => userState?.pinnedCollections?.find(sc => sc.id === collectionId),
    [userState?.pinnedCollections, collectionId],
  );
};

export default usePinnedCollectionById;

import {useMemo} from 'react';

import useCurrentUserState from './useCurrentUserState';

const useSavedCollectionById = (collectionId?: string) => {
  const userState = useCurrentUserState();

  return useMemo(
    () => userState?.savedCollections?.find(sc => sc.id === collectionId),
    [userState?.savedCollections, collectionId],
  );
};

export default useSavedCollectionById;

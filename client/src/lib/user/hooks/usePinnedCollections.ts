import {useMemo} from 'react';
import useGetCollectionById from '../../content/hooks/useGetCollectionById';

import useCurrentUserState from './useCurrentUserState';

const usePinnedCollections = () => {
  const userState = useCurrentUserState();
  const getCollectionById = useGetCollectionById();

  const pinnedCollections = useMemo(
    () =>
      userState?.pinnedCollections?.filter(pc =>
        Boolean(getCollectionById(pc.id)),
      ) ?? [],
    [userState?.pinnedCollections, getCollectionById],
  );

  return {pinnedCollections};
};

export default usePinnedCollections;

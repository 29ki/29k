import {isNotNil} from 'ramda';
import {useMemo} from 'react';
import useGetCollectionById from './useGetCollectionById';
import useCollectionIds from './useCollectionIds';

const useCollections = () => {
  const collectionIds = useCollectionIds();
  const getCollectionById = useGetCollectionById();

  return useMemo(
    () => collectionIds.map(id => getCollectionById(id)).filter(isNotNil),
    [collectionIds, getCollectionById],
  );
};

export default useCollections;

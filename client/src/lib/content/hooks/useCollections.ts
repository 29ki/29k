import {isNotNil} from 'ramda';
import {useMemo} from 'react';
import useGetCollectionById from './useGetCollectionById';
import useCollectionIds from './useCollectionIds';
import {Collection} from '../../../../../shared/src/types/generated/Collection';

const sortByOrder = (a: Collection, b: Collection) =>
  typeof a.sortOrder === 'number' && typeof b.sortOrder === 'number'
    ? a.sortOrder < b.sortOrder
      ? -1
      : 1
    : typeof a?.sortOrder === 'number'
      ? -1
      : 0;

const sortByName = (a: Collection, b: Collection) =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0;

const useCollections = () => {
  const collectionIds = useCollectionIds();
  const getCollectionById = useGetCollectionById();

  return useMemo(
    () =>
      collectionIds
        .map(id => getCollectionById(id))
        .filter(isNotNil)
        .sort(sortByName)
        .sort(sortByOrder),
    [collectionIds, getCollectionById],
  );
};

export default useCollections;

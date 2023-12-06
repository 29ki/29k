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

const useCollections = (collectionsIds?: string[]) => {
  const allIds = useCollectionIds();
  const getCollectionById = useGetCollectionById();

  const ids = collectionsIds ?? allIds;

  return useMemo(
    () =>
      ids
        .map(id => getCollectionById(id))
        .filter(isNotNil)
        .sort(sortByName)
        .sort(sortByOrder),
    [ids, getCollectionById],
  );
};

export default useCollections;

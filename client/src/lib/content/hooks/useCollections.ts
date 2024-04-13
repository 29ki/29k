import {isNotNil} from 'ramda';
import {useMemo} from 'react';
import useGetCollectionById from './useGetCollectionById';
import useCollectionIds from './useCollectionIds';
import {CollectionWithLanguage} from '../types';

const sortByOrder = (a: CollectionWithLanguage, b: CollectionWithLanguage) =>
  typeof a.sortOrder === 'number' && typeof b.sortOrder === 'number'
    ? a.sortOrder < b.sortOrder
      ? -1
      : 1
    : typeof a?.sortOrder === 'number'
      ? -1
      : 0;

const sortByName = (a: CollectionWithLanguage, b: CollectionWithLanguage) =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0;

const useCollections = (collectionsIds?: string[], sort: boolean = true) => {
  const allIds = useCollectionIds();
  const getCollectionById = useGetCollectionById();

  const ids = collectionsIds ?? allIds;

  return useMemo(() => {
    const collections = ids.map(id => getCollectionById(id)).filter(isNotNil);

    if (sort) {
      return collections.sort(sortByName).sort(sortByOrder);
    }

    return collections;
  }, [ids, sort, getCollectionById]);
};

export default useCollections;

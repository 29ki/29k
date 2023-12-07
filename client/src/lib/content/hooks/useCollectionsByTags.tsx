import {intersection} from 'ramda';
import {useMemo} from 'react';
import useCollections from './useCollections';

const useCollectionsByTags = (
  filterTags: string[],
  excludeId?: string,
  limit?: number,
) => {
  const collections = useCollections();

  return useMemo(() => {
    const filteredCollections = collections.filter(
      ({id, tags = []}) =>
        id !== excludeId && intersection(tags, filterTags).length > 0,
    );
    return limit ? filteredCollections.slice(0, limit) : filteredCollections;
  }, [filterTags, collections, excludeId, limit]);
};

export default useCollectionsByTags;

import {intersection} from 'ramda';
import useCollections from './useCollections';
import {useFeaturedCollectionIds} from './useFeaturedContent';

const useFeaturedCollections = (collectionIds?: string[]) => {
  const featuredIds = useFeaturedCollectionIds();
  const ids = collectionIds
    ? intersection(featuredIds, collectionIds)
    : featuredIds;
  return useCollections(ids, false);
};

export default useFeaturedCollections;

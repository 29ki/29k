import useCollections from './useCollections';
import useFilterContentByTags from './useFilterContentByTags';

const useCollectionsByTags = (
  filterTags: string[],
  excludeId?: string,
  limit?: number,
) => useFilterContentByTags(useCollections(), filterTags, excludeId, limit);

export default useCollectionsByTags;

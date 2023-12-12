import useCollections from './useCollections';
import {useFeaturedCollectionIds} from './useFeaturedContent';

const useFeaturedCollections = () => useCollections(useFeaturedCollectionIds());

export default useFeaturedCollections;

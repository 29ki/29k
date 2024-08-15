import useFeaturedExercises from './useFeaturedExercises';
import useFilterContentByTags from './useFilterContentByTags';

const useFeaturedExercisesByTags = (
  filterTags: string[] = [],
  excludeId?: string,
  limit?: number,
) =>
  useFilterContentByTags(useFeaturedExercises(), filterTags, excludeId, limit);

export default useFeaturedExercisesByTags;

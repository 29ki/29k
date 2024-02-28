import useExercises from './useExercises';
import useFilterContentByTags from './useFilterContentByTags';

const useExercisesByTags = (
  filterTags: string[] = [],
  excludeId?: string,
  limit?: number,
) => useFilterContentByTags(useExercises(), filterTags, excludeId, limit);

export default useExercisesByTags;

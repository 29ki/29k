import {intersection} from 'ramda';
import {useMemo} from 'react';
import useExercises from './useExercises';

const useExercisesByTags = (
  filterTags: string[] = [],
  excludeId?: string,
  limit?: number,
) => {
  const exercises = useExercises();

  return useMemo(() => {
    const filteredExercises = exercises.filter(
      ({id, tags = []}) =>
        id !== excludeId && intersection(tags, filterTags).length > 0,
    );
    return limit ? filteredExercises.slice(0, limit) : filteredExercises;
  }, [filterTags, exercises, excludeId, limit]);
};

export default useExercisesByTags;

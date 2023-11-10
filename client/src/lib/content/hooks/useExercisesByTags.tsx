import {intersection} from 'ramda';
import {useMemo} from 'react';
import useExercises from './useExercises';
import {Tag} from '../../../../../shared/src/types/generated/Tag';

const useExercisesByTags = (
  tags: Tag[],
  excludeId?: string,
  limit?: number,
) => {
  const exercises = useExercises();
  const tagNames = useMemo(() => tags?.map(t => t.tag), [tags]);

  return useMemo(() => {
    const filteredExercises = tagNames
      ? exercises.filter(
          exercise =>
            intersection(
              (exercise.tags || []).map(t => t.tag),
              tagNames,
            ).length > 0 && exercise.id !== excludeId,
        )
      : [];
    return limit ? filteredExercises.slice(0, limit) : filteredExercises;
  }, [tagNames, exercises, excludeId, limit]);
};

export default useExercisesByTags;

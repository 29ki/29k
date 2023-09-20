import {intersection} from 'ramda';
import {useMemo} from 'react';
import useExercises from './useExercises';
import {Tag} from '../../../../../shared/src/types/generated/Tag';

const useExercisesByTags = (tags: Tag[], excludeId?: string) => {
  const exercises = useExercises();
  const tagNames = useMemo(() => tags?.map(t => t.tag), [tags]);

  return useMemo(
    () =>
      tagNames
        ? exercises.filter(
            e =>
              intersection(
                (e.tags || []).map(t => t.tag),
                tagNames,
              ).length > 0 && e.id !== excludeId,
          )
        : [],
    [tagNames, exercises, excludeId],
  );
};

export default useExercisesByTags;

import {useMemo} from 'react';
import useExercisesOriginal from './useExercises.ts';

const useExercises = (exerciseIds?: string[], sort: boolean = true) => {
  const exercises = useExercisesOriginal(exerciseIds, sort);

  return useMemo(
    () => exercises.filter(({excludeFromWeb}) => !excludeFromWeb),
    [exercises],
  );
};

export default useExercises;

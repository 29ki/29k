import {useMemo} from 'react';
import useExerciseIds from './useExerciseIds';
import useGetExerciseById from './useGetExerciseById';

const useExercises = () => {
  const exerciseIds = useExerciseIds();
  const getExerciseById = useGetExerciseById();

  return useMemo(
    () =>
      exerciseIds
        .map(id => getExerciseById(id))
        .sort((a, b) => (a.name < b.name ? -1 : 1)),
    [exerciseIds, getExerciseById],
  );
};

export default useExercises;

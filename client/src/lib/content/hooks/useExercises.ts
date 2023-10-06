import {isNotNil} from 'ramda';
import {useMemo} from 'react';
import useExerciseIds from './useExerciseIds';
import useGetExerciseById from './useGetExerciseById';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';

const sortByName = (a: Exercise, b: Exercise) =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0;

const useExercises = () => {
  const exerciseIds = useExerciseIds();
  const getExerciseById = useGetExerciseById();

  return useMemo(
    () =>
      exerciseIds
        .map(id => getExerciseById(id))
        .filter(isNotNil)
        .sort(sortByName),
    [exerciseIds, getExerciseById],
  );
};

export default useExercises;

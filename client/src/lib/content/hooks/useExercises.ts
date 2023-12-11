import {isNotNil} from 'ramda';
import {useMemo} from 'react';
import useExerciseIds from './useExerciseIds';
import useGetExerciseById from './useGetExerciseById';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';

const sortByName = (a: Exercise, b: Exercise) =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0;

const useExercises = (exerciseIds?: string[]) => {
  const allIds = useExerciseIds();
  const getExerciseById = useGetExerciseById();

  const ids = exerciseIds ?? allIds;

  return useMemo(
    () =>
      ids
        .map(id => getExerciseById(id))
        .filter(isNotNil)
        .sort(sortByName),
    [ids, getExerciseById],
  );
};

export default useExercises;

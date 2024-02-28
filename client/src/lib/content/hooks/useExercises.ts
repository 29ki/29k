import {isNotNil} from 'ramda';
import {useMemo} from 'react';
import useExerciseIds from './useExerciseIds';
import useGetExerciseById from './useGetExerciseById';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';

const sortByName = (a: Exercise, b: Exercise) =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0;

const useExercises = (exerciseIds?: string[], sort: boolean = true) => {
  const allIds = useExerciseIds();
  const getExerciseById = useGetExerciseById();

  const ids = exerciseIds ?? allIds;

  return useMemo(() => {
    const exercises = ids.map(id => getExerciseById(id)).filter(isNotNil);

    if (sort) {
      return exercises.sort(sortByName);
    }

    return exercises;
  }, [ids, sort, getExerciseById]);
};

export default useExercises;

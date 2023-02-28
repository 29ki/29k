import {useMemo} from 'react';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import useGetExerciseById from './useGetExerciseById';

const useExerciseById = (id: string | undefined): Exercise | null => {
  const getExerciseById = useGetExerciseById();

  return useMemo(
    () => (id ? getExerciseById(id) : null),
    [getExerciseById, id],
  );
};

export default useExerciseById;

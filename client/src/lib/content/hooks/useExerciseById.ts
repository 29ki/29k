import {useMemo} from 'react';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import useGetExerciseById from './useGetExerciseById';
import {LANGUAGE_TAG} from '../../i18n';

const useExerciseById = (
  id: string | undefined,
  language?: LANGUAGE_TAG,
): Exercise | null => {
  const getExerciseById = useGetExerciseById();

  return useMemo(
    () => (id ? getExerciseById(id, language) : null),
    [getExerciseById, id, language],
  );
};

export default useExerciseById;

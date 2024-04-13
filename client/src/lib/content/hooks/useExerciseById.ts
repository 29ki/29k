import {useMemo} from 'react';
import useGetExerciseById from './useGetExerciseById';
import {ExerciseWithLanguage} from '../types';
import {LANGUAGE_TAG} from '../../i18n';

const useExerciseById = (
  id: string | undefined,
  language?: LANGUAGE_TAG,
): ExerciseWithLanguage | null => {
  const getExerciseById = useGetExerciseById();

  return useMemo(
    () => (id ? getExerciseById(id, language) : null),
    [getExerciseById, id, language],
  );
};

export default useExerciseById;

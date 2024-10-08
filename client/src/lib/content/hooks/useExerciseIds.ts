import {useTranslation} from 'react-i18next';
import {useMemo} from 'react';
import {ExerciseWithLanguage} from '../types';
import {DEFAULT_LANGUAGE_TAG} from '../../../../../shared/src/i18n/constants';

const getExerciseIds = (
  content: Record<string, Record<string, string>> | undefined,
) => {
  if (content) {
    return Object.keys(content.exercises);
  }
  return [];
};

const useExerciseIds: () => ExerciseWithLanguage['id'][] = () => {
  const {i18n} = useTranslation('exercises');
  // Default to allways list exercises avalible in English
  return useMemo(
    () => getExerciseIds(i18n.getDataByLanguage(DEFAULT_LANGUAGE_TAG)),
    [i18n],
  );
};

export default useExerciseIds;

import {useTranslation} from 'react-i18next';
import {DEFAULT_LANGUAGE_TAG} from '../../i18n';

const getExerciseIds = (
  content: Record<string, Record<string, string>> | undefined,
) => {
  if (content) {
    return Object.keys(content.exercises);
  }
  return [];
};

const useExerciseIds = () => {
  const {i18n} = useTranslation('exercises');
  return getExerciseIds(i18n.getDataByLanguage(DEFAULT_LANGUAGE_TAG));
};

export default useExerciseIds;

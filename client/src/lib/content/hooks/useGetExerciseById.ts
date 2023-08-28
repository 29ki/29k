import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import {LANGUAGE_TAG} from '../../i18n';

const useGetExerciseById = () => {
  const {t} = useTranslation('exercises');

  return useCallback(
    (id: string, language?: LANGUAGE_TAG) => {
      const exercise = t(id, {
        returnObjects: true,
        lng: language,
      });

      // i18next fallbacks to the key if no translation is found
      return typeof exercise === 'object' ? (exercise as Exercise) : null;
    },
    [t],
  );
};

export default useGetExerciseById;

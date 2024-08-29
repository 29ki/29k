import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import {ExerciseWithLanguage} from '../types';
import {LANGUAGE_TAG} from '../../../../../shared/src/i18n/constants';

const useGetExerciseById = () => {
  const {t} = useTranslation('exercises');

  return useCallback(
    (id: string, language?: LANGUAGE_TAG): ExerciseWithLanguage | null => {
      const translation = t(id, {
        lng: language,
        returnObjects: true,
        returnDetails: true,
        keySeparator: false, // prevents object from being copied
      });

      // i18next fallbacks to the key if no translation is found
      if (typeof translation.res !== 'object') {
        return null;
      }
      const exercise = {
        ...(translation.res as Exercise),
        language: translation.usedLng as LANGUAGE_TAG,
      };

      return exercise;
    },
    [t],
  );
};

export default useGetExerciseById;

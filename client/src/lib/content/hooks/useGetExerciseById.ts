import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import useUnlockedExerciseIds from '../../user/hooks/useUnlockedExerciseIds';
import useAppState from '../../appState/state/state';
import {ExerciseWithLanguage} from '../types';
import {LANGUAGE_TAG} from '../../../../../shared/src/i18n/constants';

const useGetExerciseById = () => {
  const {t} = useTranslation('exercises');
  const unlockedExerciseIds = useUnlockedExerciseIds();
  const showLockedContent = useAppState(
    state => state.settings.showLockedContent,
  );

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

      if (
        exercise.locked &&
        !showLockedContent &&
        !unlockedExerciseIds.includes(exercise.id)
      ) {
        return null;
      }

      return exercise;
    },
    [t, showLockedContent, unlockedExerciseIds],
  );
};

export default useGetExerciseById;

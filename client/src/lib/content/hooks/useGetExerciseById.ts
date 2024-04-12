import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import {LANGUAGE_TAG} from '../../i18n';
import useUnlockedExerciseIds from '../../user/hooks/useUnlockedExerciseIds';
import useAppState from '../../appState/state/state';

const useGetExerciseById = () => {
  const {t} = useTranslation('exercises');
  const unlockedExerciseIds = useUnlockedExerciseIds();
  const showLockedContent = useAppState(
    state => state.settings.showLockedContent,
  );

  return useCallback(
    (id: string, language?: LANGUAGE_TAG) => {
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

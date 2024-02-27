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
      const exercise = t(id, {
        returnObjects: true,
        lng: language,
      }) as Exercise;

      if (
        // i18next fallbacks to the key if no translation is found
        typeof exercise !== 'object' ||
        (exercise.locked &&
          !showLockedContent &&
          !unlockedExerciseIds.includes(exercise.id))
      ) {
        return null;
      }

      return exercise;
    },
    [t, showLockedContent, unlockedExerciseIds],
  );
};

export default useGetExerciseById;

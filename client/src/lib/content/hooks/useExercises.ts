import {useMemo} from 'react';
import useAppState from '../../appState/state/state';
import {DEFAULT_LANGUAGE_TAG} from '../../i18n';
import useExerciseIds from './useExerciseIds';
import useGetExerciseById from './useGetExerciseById';

const useExercises = () => {
  const exerciseIds = useExerciseIds();
  const getExerciseById = useGetExerciseById();
  const preferedLanguage = useAppState(
    state => state.settings.preferredLanguage,
  );

  return useMemo(
    () =>
      exerciseIds
        .map(id =>
          getExerciseById(id, preferedLanguage ?? DEFAULT_LANGUAGE_TAG),
        )
        .sort((a, b) => (a.name < b.name ? -1 : 1)),
    [exerciseIds, getExerciseById, preferedLanguage],
  );
};

export default useExercises;

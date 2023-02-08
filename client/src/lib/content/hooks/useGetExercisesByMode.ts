import {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import {SessionMode} from '../../../../../shared/src/types/Session';

import useExerciseIds from './useExerciseIds';

const useGetExercisesByMode = (sessionMode?: SessionMode) => {
  const {t} = useTranslation('exercises');
  const exerciseIds = useExerciseIds();

  const getExerciseById = useCallback(
    (id: string) =>
      t(id, {
        returnObjects: true,
      }) as Exercise,
    [t],
  );

  return useMemo(() => {
    return exerciseIds
      .map(getExerciseById)
      .filter(e => (sessionMode === SessionMode.async ? e.async : true));
  }, [exerciseIds, getExerciseById, sessionMode]);
};

export default useGetExercisesByMode;

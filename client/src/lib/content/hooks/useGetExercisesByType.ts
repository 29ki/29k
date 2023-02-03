import {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import {SessionType} from '../../../../../shared/src/types/Session';

import useExerciseIds from './useExerciseIds';

const useGetExercisesByType = (sessionType?: SessionType) => {
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
      .filter(e => (sessionType === SessionType.async ? e.async : true));
  }, [exerciseIds, getExerciseById, sessionType]);
};

export default useGetExercisesByType;

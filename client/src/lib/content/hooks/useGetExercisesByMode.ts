import {useMemo} from 'react';
import {SessionMode} from '../../../../../shared/src/types/Session';

import useExerciseIds from './useExerciseIds';
import useGetExerciseById from './useGetExerciseById';

const useGetExercisesByMode = (sessionMode?: SessionMode) => {
  const exerciseIds = useExerciseIds();
  const getExerciseById = useGetExerciseById();

  return useMemo(() => {
    return exerciseIds
      .map(exerciseId => getExerciseById(exerciseId))
      .filter(e => (e && sessionMode === SessionMode.async ? e.async : true));
  }, [exerciseIds, getExerciseById, sessionMode]);
};

export default useGetExercisesByMode;

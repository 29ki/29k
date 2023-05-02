import {useMemo} from 'react';
import {SessionMode} from '../../../../../shared/src/schemas/Session';

import useExercises from './useExercises';

const useGetExercisesByMode = (sessionMode?: SessionMode) => {
  const exercises = useExercises();

  return useMemo(() => {
    return exercises.filter(e =>
      sessionMode === SessionMode.async ? e.async : e.live,
    );
  }, [exercises, sessionMode]);
};

export default useGetExercisesByMode;

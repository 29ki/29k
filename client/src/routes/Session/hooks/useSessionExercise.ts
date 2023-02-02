import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import useSessionState from '../state/state';

const useSessionExercise = (): Exercise | null => {
  const exerciseId = useSessionState(state => state.session?.exerciseId);
  const excercise = useExerciseById(exerciseId);
  return exerciseId ? excercise : null;
};

export default useSessionExercise;

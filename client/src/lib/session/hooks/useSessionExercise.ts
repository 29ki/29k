import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import useSessionState from '../state/state';

const useSessionExercise = (): Exercise | null => {
  const liveSession = useSessionState(state => state.liveSession);
  const asyncSession = useSessionState(state => state.asyncSession);
  return useExerciseById(liveSession?.exerciseId ?? asyncSession?.exerciseId);
};

export default useSessionExercise;

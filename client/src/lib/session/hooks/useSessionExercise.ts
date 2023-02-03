import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import useSessionState from '../state/state';

const useSessionExercise = (): Exercise | null => {
  const liveSession = useSessionState(state => state.session);
  const asyncSession = useSessionState(state => state.asyncSession);
  return useExerciseById(liveSession?.contentId ?? asyncSession?.contentId);
};

export default useSessionExercise;

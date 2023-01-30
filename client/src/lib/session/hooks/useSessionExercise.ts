import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import useSessionState from '../state/state';

const useSessionExercise = (): Exercise | null => {
  const contentId = useSessionState(state => state.session?.contentId);
  const excercise = useExerciseById(contentId);
  return contentId ? excercise : null;
};

export default useSessionExercise;

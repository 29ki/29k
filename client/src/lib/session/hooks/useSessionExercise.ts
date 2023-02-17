import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import useSessionState from '../state/state';

const useSessionExercise = (): Exercise | null =>
  useSessionState(state => state.exercise);

export default useSessionExercise;

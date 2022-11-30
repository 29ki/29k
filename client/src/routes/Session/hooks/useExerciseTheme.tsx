import {ExerciseTheme} from '../../../../../shared/src/types/generated/Exercise';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import useSessionState from '../state/state';

const useExerciseTheme = (): ExerciseTheme | undefined => {
  const contentId = useSessionState(state => state.session?.contentId);
  const excerciseTheme = useExerciseById(contentId)?.theme;

  return excerciseTheme;
};

export default useExerciseTheme;

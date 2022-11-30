import {ExerciseSlide} from '../../../../../shared/src/types/Content';
import {
  Exercise,
  ExerciseTheme,
} from '../../../../../shared/src/types/generated/Exercise';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import useSessionState from '../state/state';

export type SessionExercise = Exercise & {
  slide: {
    index: number;
    previous?: ExerciseSlide;
    current: ExerciseSlide;
    next?: ExerciseSlide;
  };
};

const useExerciseTheme = (): ExerciseTheme | undefined => {
  const contentId = useSessionState(state => state.session?.contentId);
  const excerciseTheme = useExerciseById(contentId)?.theme;

  return excerciseTheme;
};

export default useExerciseTheme;

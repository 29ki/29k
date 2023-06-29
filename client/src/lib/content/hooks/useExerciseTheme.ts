import {useMemo} from 'react';
import {
  Exercise,
  ExerciseTheme,
} from '../../../../../shared/src/types/generated/Exercise';

const useExerciseTheme = (
  exercise: Exercise | null | undefined,
): ExerciseTheme | undefined => {
  return useMemo(() => {
    if (exercise?.theme) {
      return {
        textColor:
          exercise.theme.textColor && exercise.theme.textColor.length > 0
            ? exercise.theme.textColor
            : undefined,
        backgroundColor:
          exercise.theme.backgroundColor &&
          exercise.theme.backgroundColor.length > 0
            ? exercise.theme.backgroundColor
            : undefined,
      };
    }
  }, [exercise?.theme]);
};

export default useExerciseTheme;

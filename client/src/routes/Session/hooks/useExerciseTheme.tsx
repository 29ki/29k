import {ExerciseTheme} from '../../../../../shared/src/types/generated/Exercise';
import useSessionExercise from './useSessionExercise';

const useExerciseTheme = (): ExerciseTheme | undefined => {
  const excerciseTheme = useSessionExercise()?.theme;
  return excerciseTheme;
};

export default useExerciseTheme;

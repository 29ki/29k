import {useMemo} from 'react';
import {ExerciseSlide} from '../../../../../shared/src/types/Content';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import useSessionState from '../state/state';

type SessionExercise = Exercise & {
  slide: {
    index: number;
    previous?: ExerciseSlide;
    current: ExerciseSlide;
    next?: ExerciseSlide;
  };
};

const useSessionExercise = (): SessionExercise | null => {
  const session = useSessionState(state => state.session);
  const excercise = useExerciseById(session?.contentId);

  const exerciseState = session?.exerciseState;

  return useMemo(() => {
    if (!excercise || !exerciseState) {
      return null;
    }

    const index = exerciseState.index;
    const previous = excercise.slides[index - 1];
    const current = excercise.slides[index];
    const next = excercise.slides[index + 1];

    return {
      ...excercise,
      slide: {
        index,
        previous,
        current,
        next,
      },
    };
  }, [excercise, exerciseState]);
};

export default useSessionExercise;

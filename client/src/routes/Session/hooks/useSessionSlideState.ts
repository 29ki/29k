import {useMemo} from 'react';

import {ExerciseSlide} from '../../../../../shared/src/types/Content';
import useSessionState from '../state/state';
import useSessionExercise from './useSessionExercise';

export type SessionSlideState = {
  index: number;
  previous?: ExerciseSlide;
  current: ExerciseSlide;
  next?: ExerciseSlide;
};

const useSessionSlideState = (): SessionSlideState | null => {
  const exerciseState = useSessionState(state => state.session?.exerciseState);
  const excercise = useSessionExercise();

  return useMemo(() => {
    if (!excercise || !exerciseState) {
      return null;
    }

    const index = exerciseState.index;
    const previous = excercise.slides[index - 1];
    const current = excercise.slides[index];
    const next = excercise.slides[index + 1];

    return {
      index,
      previous,
      current,
      next,
    };
  }, [excercise, exerciseState]);
};

export default useSessionSlideState;

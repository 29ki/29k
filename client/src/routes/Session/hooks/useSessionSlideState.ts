import {useMemo} from 'react';

import {ExerciseSlide} from '../../../../../shared/src/types/Content';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import useSessionState from '../state/state';

export type SessionSlideState = {
  index: number;
  previous?: ExerciseSlide;
  current: ExerciseSlide;
  next?: ExerciseSlide;
};

const useSessionSlideState = (): SessionSlideState | null => {
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
      index,
      previous,
      current,
      next,
    };
  }, [excercise, exerciseState]);
};

export default useSessionSlideState;

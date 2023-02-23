import {useMemo} from 'react';

import {ExerciseSlide} from '../../../../../shared/src/types/Content';
import useSessionState from '../state/state';

export type SessionSlideState = {
  index: number;
  previous?: ExerciseSlide;
  current: ExerciseSlide;
  next?: ExerciseSlide;
};

const useSessionSlideState = (): SessionSlideState | null => {
  const sessionState = useSessionState(state => state.sessionState);
  const exercise = useSessionState(state => state.exercise);

  return useMemo(() => {
    if (!exercise || typeof sessionState?.index !== 'number') {
      return null;
    }

    const index = sessionState?.index;
    const previous = exercise.slides[index - 1];
    const current = exercise.slides[index];
    const next = exercise.slides[index + 1];

    return {
      index,
      previous,
      current,
      next,
    };
  }, [exercise, sessionState?.index]);
};

export default useSessionSlideState;

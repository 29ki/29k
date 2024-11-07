import {useMemo} from 'react';

import {ExerciseSlide} from '../../../../../shared/src/types/Content';
import useSessionState from '../state/state';

export type SessionSlideState = {
  index: number;
  previous?: ExerciseSlide;
  current: ExerciseSlide;
  next?: ExerciseSlide;
};

const useLiveSessionSlideState = (): SessionSlideState | null => {
  const sessionState = useSessionState(state => state.sessionState);
  const exercise = useSessionState(state => state.exercise);

  return useMemo(() => {
    if (!exercise || typeof sessionState?.index !== 'number') {
      return null;
    }

    const slides = exercise.slides.filter(
      slide => slide.type !== 'host' && slide.type !== 'instruction',
    );

    const index = sessionState?.index;
    const previous = slides[index - 1];
    const current = slides[index];
    const next = slides[index + 1];

    return {
      index,
      previous,
      current,
      next,
      slides,
    };
  }, [exercise, sessionState?.index]);
};

export default useLiveSessionSlideState;

import {useMemo} from 'react';
import {useRecoilValue} from 'recoil';
import {Exercise, ExerciseSlide} from '../../../../../shared/src/types/Content';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import {templeAtom} from '../state/state';

type TempleExercise = Exercise & {
  slide: {
    index: number;
    previous?: ExerciseSlide;
    current: ExerciseSlide;
    next?: ExerciseSlide;
  };
};

const useTempleExercise = (): TempleExercise | null => {
  const temple = useRecoilValue(templeAtom);
  const excercise = useExerciseById(temple?.contentId);

  const exerciseState = temple?.exerciseState;

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

export default useTempleExercise;

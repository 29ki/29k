import {useRecoilValue} from 'recoil';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import {templeAtom} from '../state/state';

const useTempleExercise = () => {
  const temple = useRecoilValue(templeAtom);
  const excercise = useExerciseById(temple?.contentId);

  if (!excercise || !temple) {
    return null;
  }

  const previous = excercise.slides[temple.exerciseState.index - 1];
  const current = excercise.slides[temple.exerciseState.index];
  const next = excercise.slides[temple.exerciseState.index + 1];

  return {
    ...excercise,
    slide: {
      index: temple.exerciseState.index,
      previous,
      current,
      next,
    },
  };
};

export default useTempleExercise;

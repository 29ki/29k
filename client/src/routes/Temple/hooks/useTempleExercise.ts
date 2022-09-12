import {useRecoilValue} from 'recoil';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import {templeAtom} from '../state/state';

const useTempleExercise = () => {
  const temple = useRecoilValue(templeAtom);
  const excercise = useExerciseById(temple?.contentId);

  if (!excercise || !temple) {
    return null;
  }

  const previous = excercise.slides[temple?.index - 1];
  const current = excercise.slides[temple?.index];
  const next = excercise.slides[temple?.index + 1];

  return {
    ...excercise,
    slide: {
      previous,
      current,
      next,
    },
  };
};

export default useTempleExercise;

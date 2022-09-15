import {useContext, useEffect} from 'react';
import {useRecoilValue} from 'recoil';

import {DailyContext} from '../DailyProvider';
import {templeExerciseStateSelector} from '../state/state';
import useTempleExercise from './useTempleExercise';

const useSubscribeToExerciseState = () => {
  const {toggleAudio} = useContext(DailyContext);
  const exerciseState = useRecoilValue(templeExerciseStateSelector);
  const excercise = useTempleExercise();

  useEffect(() => {
    if (exerciseState?.playing && excercise?.slide.current.type !== 'sharing') {
      toggleAudio(false);
    }
  }, [toggleAudio, exerciseState, excercise]);
};

export default useSubscribeToExerciseState;

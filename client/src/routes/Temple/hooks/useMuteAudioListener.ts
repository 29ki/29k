import {useContext, useEffect} from 'react';
import {useRecoilValue} from 'recoil';

import {DailyContext} from '../DailyProvider';
import {templeExerciseStateSelector} from '../state/state';

const useSubscribeToExerciseState = () => {
  const {toggleAudio} = useContext(DailyContext);
  const exerciseState = useRecoilValue(templeExerciseStateSelector);

  useEffect(() => {
    if (exerciseState?.playing) {
      toggleAudio(false);
    }
  }, [toggleAudio, exerciseState]);
};

export default useSubscribeToExerciseState;

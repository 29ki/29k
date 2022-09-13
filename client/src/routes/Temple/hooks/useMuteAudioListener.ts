import {useContext, useEffect} from 'react';
import {useRecoilValue} from 'recoil';

import {DailyContext} from '../DailyProvider';
import {templeAtom} from '../state/state';

const useSubscribeToExerciseState = () => {
  const {toggleAudio} = useContext(DailyContext);
  const temple = useRecoilValue(templeAtom);

  useEffect(() => {
    if (temple?.exerciseState.playing) {
      toggleAudio(false);
    }
  }, [toggleAudio, temple?.exerciseState]);
};

export default useSubscribeToExerciseState;

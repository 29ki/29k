import {useContext, useEffect} from 'react';
import {useRecoilValue} from 'recoil';

import {DailyContext} from '../../../lib/daily/DailyProvider';
import {sessionExerciseStateSelector} from '../state/state';
import useSessionExercise from './useSessionExercise';

const useMuteAudioListener = () => {
  const {toggleAudio} = useContext(DailyContext);
  const exerciseState = useRecoilValue(sessionExerciseStateSelector);
  const excercise = useSessionExercise();

  useEffect(() => {
    if (exerciseState?.playing && excercise?.slide.current.type !== 'sharing') {
      toggleAudio(false);
    }
  }, [toggleAudio, exerciseState, excercise]);
};

export default useMuteAudioListener;

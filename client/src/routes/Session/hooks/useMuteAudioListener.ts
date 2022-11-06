import {useContext, useEffect} from 'react';

import {DailyContext} from '../../../lib/daily/DailyProvider';
import useSessionState from '../state/state';
import useSessionExercise from './useSessionExercise';

const useMuteAudioListener = () => {
  const {toggleAudio} = useContext(DailyContext);
  const exerciseState = useSessionState(state => state.session?.exerciseState);
  const excercise = useSessionExercise();

  useEffect(() => {
    if (exerciseState?.playing && excercise?.slide.current.type !== 'sharing') {
      toggleAudio(false);
    }
  }, [toggleAudio, exerciseState, excercise]);
};

export default useMuteAudioListener;

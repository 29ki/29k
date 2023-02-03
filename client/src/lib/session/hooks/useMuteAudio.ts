import {useCallback, useContext} from 'react';
import {ExerciseSlide} from '../../../../../shared/src/types/Content';

import {DailyContext} from '../../../lib/daily/DailyProvider';

const useMuteAudio = () => {
  const {muteAll} = useContext(DailyContext);

  const conditionallyMuteParticipants = useCallback(
    (playing: boolean, currentSlide: ExerciseSlide | undefined) => {
      if (playing && currentSlide?.type !== 'sharing') {
        muteAll();
      }
    },
    [muteAll],
  );

  return {conditionallyMuteParticipants};
};

export default useMuteAudio;

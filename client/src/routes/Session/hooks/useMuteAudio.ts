import {useCallback, useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {ExerciseSlide} from '../../../../../shared/src/types/Content';
import {MicrophoneOffIcon} from '../../../lib/components/Icons';

import {DailyContext} from '../../../lib/daily/DailyProvider';
import useSessionNotificationsState from '../state/sessionNotificationsState';

const useMuteAudio = () => {
  const {t} = useTranslation('Screen.Session');
  const {muteAll} = useContext(DailyContext);
  const addNotification = useSessionNotificationsState(
    state => state.addNotification,
  );

  const conditionallyMuteParticipants = useCallback(
    (playing: boolean, currentSlide: ExerciseSlide | undefined) => {
      if (playing && currentSlide?.type !== 'sharing') {
        muteAll();
        addNotification({
          text: t('notifications.muted'),
          Icon: MicrophoneOffIcon,
        });
      }
    },
    [muteAll, addNotification, t],
  );

  return {conditionallyMuteParticipants};
};

export default useMuteAudio;

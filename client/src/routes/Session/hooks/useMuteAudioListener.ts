import {useContext, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {MicrophoneOffIcon} from '../../../common/components/Icons';

import {DailyContext} from '../../../lib/daily/DailyProvider';
import useSessionNotificationsState from '../state/sessionNotificationsState';
import useSessionState from '../state/state';
import useIsSessionHost from './useIsSessionHost';
import useSessionSlideState from './useSessionSlideState';

const useMuteAudioListener = () => {
  const {t} = useTranslation('Screen.Session');
  const {toggleAudio} = useContext(DailyContext);
  const exerciseState = useSessionState(state => state.session?.exerciseState);
  const slideState = useSessionSlideState();
  const isSessionHost = useIsSessionHost();
  const addNotification = useSessionNotificationsState(
    state => state.addNotification,
  );

  useEffect(() => {
    if (exerciseState?.playing && slideState?.current.type !== 'sharing') {
      toggleAudio(false);

      if (isSessionHost) {
        addNotification({
          text: t('notifications.muted'),
          Icon: MicrophoneOffIcon,
        });
      }
    }
  }, [
    toggleAudio,
    exerciseState?.playing,
    addNotification,
    t,
    isSessionHost,
    slideState,
  ]);
};

export default useMuteAudioListener;

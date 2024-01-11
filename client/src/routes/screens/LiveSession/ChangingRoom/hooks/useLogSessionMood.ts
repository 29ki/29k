import {useCallback} from 'react';
import useSessionState from '../../../../../lib/session/state/state';
import useAddUserEvent from '../../../../../lib/user/hooks/useAddUserEvent';
import * as metrics from '../../../../../lib/metrics';
import {useTranslation} from 'react-i18next';
import {DEFAULT_LANGUAGE_TAG} from '../../../../../lib/i18n';

const useLogSessionMood = () => {
  const {t} = useTranslation('Component.SharingSessionMood');
  const mood = useSessionState(state => state.mood);
  const liveSession = useSessionState(state => state.liveSession);
  const addUserEvent = useAddUserEvent();

  return useCallback(() => {
    if (mood && liveSession) {
      metrics.logEvent('Answer Sharing Session Mood', {
        'Sharing Session Mood Question': t('question', {
          lng: DEFAULT_LANGUAGE_TAG,
        }),
        'Sharing Session Mood': mood,
      });

      addUserEvent('mood', {
        type: 'liveSession',
        question: t('question'),
        mood,
        sessionId: liveSession.id,
        exerciseId: liveSession.exerciseId,
      });
    }
  }, [mood, liveSession, t, addUserEvent]);
};

export default useLogSessionMood;

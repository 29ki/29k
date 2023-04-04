import {useCallback} from 'react';
import {Platform} from 'react-native';
import useSessionFeedback from '../../session/hooks/useSessionFeedback';
import useAppState, {APP_RATING_REVISION} from '../state/state';

const useRating = () => {
  const appRatedRevision = useAppState(
    state => state.settings.appRatedRevision,
  );
  const setSetting = useAppState(state => state.setSettings);
  const {getFeedbackForSession} = useSessionFeedback();

  return useCallback(
    (sessionId: string) => {
      const feedback = getFeedbackForSession(sessionId);

      // TODO remove android only when app is public on App Store
      if (Platform.OS === 'android') {
        if (
          feedback?.payload.answer &&
          (!appRatedRevision || appRatedRevision < APP_RATING_REVISION)
        ) {
          setSetting({appRatedRevision: APP_RATING_REVISION});
          return true;
        }
      }

      return false;
    },
    [setSetting, appRatedRevision, getFeedbackForSession],
  );
};

export default useRating;

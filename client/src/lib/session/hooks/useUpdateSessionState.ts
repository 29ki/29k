import {useCallback, useContext} from 'react';
import {ExerciseSlide} from '../../../../../shared/src/types/Content';
import {
  SessionStateType,
  LiveSessionType,
} from '../../../../../shared/src/schemas/Session';
import * as sessionApi from '../../sessions/api/session';
import {useTranslation} from 'react-i18next';
import {ErrorBannerContext} from '../../contexts/ErrorBannerContext';

const useUpdateSessionState = (
  sessionId: LiveSessionType['id'] | undefined,
) => {
  const {t} = useTranslation('Component.NetworkError');
  const errorBannerContext = useContext(ErrorBannerContext);

  const showNetworkRequestError = useCallback(() => {
    errorBannerContext?.showError(t('requestTitle'), t('requestMessage'));
  }, [t, errorBannerContext]);

  const startSession = useCallback(async () => {
    if (sessionId) {
      try {
        await sessionApi.updateSessionState(sessionId, {
          started: true,
        });
      } catch (error) {
        showNetworkRequestError();
        throw error;
      }
    }
  }, [sessionId, showNetworkRequestError]);

  const endSession = useCallback(async () => {
    if (sessionId) {
      try {
        await sessionApi.updateSessionState(sessionId, {
          ended: true,
        });
      } catch (error) {
        showNetworkRequestError();
        throw error;
      }
    }
  }, [sessionId, showNetworkRequestError]);

  const navigateToIndex = useCallback(
    async ({
      index,
      content,
    }: {
      index: SessionStateType['index'];
      content: ExerciseSlide[];
    }) => {
      if (!sessionId || index < 0 || index > content.length - 1) {
        return;
      }

      const completed = index === content.length - 1 ? true : undefined;

      try {
        return await sessionApi.updateSessionState(sessionId, {
          index,
          playing: false,
          completed,
        });
      } catch (error) {
        showNetworkRequestError();
        throw error;
      }
    },
    [sessionId, showNetworkRequestError],
  );

  const setPlaying = useCallback(
    async (playing: SessionStateType['playing']) => {
      if (sessionId) {
        try {
          return await sessionApi.updateSessionState(sessionId, {playing});
        } catch (error) {
          showNetworkRequestError();
          throw error;
        }
      }
    },
    [sessionId, showNetworkRequestError],
  );

  return {
    navigateToIndex,
    setPlaying,
    startSession,
    endSession,
  };
};
export default useUpdateSessionState;

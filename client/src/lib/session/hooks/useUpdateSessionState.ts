import {useCallback} from 'react';
import {ExerciseSlide} from '../../../../../shared/src/types/Content';
import {
  SessionState,
  LiveSession,
} from '../../../../../shared/src/schemas/Session';
import * as sessionApi from '../../sessions/api/session';

const useUpdateSessionState = (sessionId: LiveSession['id'] | undefined) => {
  const startSession = useCallback(async () => {
    if (sessionId) {
      sessionApi.updateSessionState(sessionId, {
        started: true,
      });
    }
  }, [sessionId]);

  const endSession = useCallback(async () => {
    if (sessionId) {
      sessionApi.updateSessionState(sessionId, {
        ended: true,
      });
    }
  }, [sessionId]);

  const navigateToIndex = useCallback(
    async ({
      index,
      content,
    }: {
      index: SessionState['index'];
      content: ExerciseSlide[];
    }) => {
      if (!sessionId || index < 0 || index > content.length - 1) {
        return;
      }

      const completed = index === content.length - 1 ? true : undefined;

      return sessionApi.updateSessionState(sessionId, {
        index,
        playing: false,
        completed,
      });
    },
    [sessionId],
  );

  const setPlaying = useCallback(
    async (playing: SessionState['playing']) => {
      if (sessionId) {
        return sessionApi.updateSessionState(sessionId, {playing});
      }
    },
    [sessionId],
  );

  return {
    navigateToIndex,
    setPlaying,
    startSession,
    endSession,
  };
};
export default useUpdateSessionState;

import dayjs from 'dayjs';
import {useCallback} from 'react';
import {ExerciseSlide} from '../../../../../shared/src/types/Content';
import {
  SessionState,
  AsyncSession,
} from '../../../../../shared/src/types/Session';
import useSessionState from '../state/state';

const useUpdateAsyncSessionState = (session: AsyncSession) => {
  const setSessionState = useSessionState(state => state.setSessionState);
  const setPartialSessionState = useSessionState(
    state => state.setPartialSessionState,
  );
  const startSession = useCallback(async () => {
    setSessionState({
      index: 0,
      playing: false,
      started: true,
      ended: false,
      id: session.id,
      completed: false,
      timestamp: dayjs.utc().toJSON(),
    });
  }, [session?.id, setSessionState]);

  const endSession = useCallback(async () => {
    setPartialSessionState({
      ended: true,
      playing: false,
      timestamp: dayjs.utc().toJSON(),
    });
  }, [setPartialSessionState]);

  const navigateToIndex = useCallback(
    async ({
      index,
      content,
    }: {
      index: SessionState['index'];
      content: ExerciseSlide[];
    }) => {
      if (index < 0 || index > content.length - 1) {
        return;
      }

      const completed = index === content.length - 1 ? true : undefined;
      setPartialSessionState({
        index,
        playing: false,
        completed,
        timestamp: dayjs.utc().toJSON(),
      });
    },
    [setPartialSessionState],
  );

  const setPlaying = useCallback(
    async (playing: SessionState['playing']) => {
      setPartialSessionState({playing, timestamp: dayjs.utc().toJSON()});
    },
    [setPartialSessionState],
  );

  return {
    navigateToIndex,
    setPlaying,
    startSession,
    endSession,
  };
};
export default useUpdateAsyncSessionState;

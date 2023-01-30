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
    setPartialSessionState({ended: true});
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
      setPartialSessionState({index, playing: false, completed});
    },
    [setPartialSessionState],
  );

  const setPlaying = useCallback(
    async (playing: SessionState['playing']) => {
      setPartialSessionState({playing});
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

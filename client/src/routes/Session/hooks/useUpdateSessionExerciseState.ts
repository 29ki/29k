import {useCallback} from 'react';
import {ExerciseSlide} from '../../../../../shared/src/types/Content';
import {ExerciseState, Session} from '../../../../../shared/src/types/Session';
import * as sessionApi from '../../../lib/sessions/api/session';

const useUpdateSessionExerciseState = (
  sessionId: Session['id'] | undefined,
) => {
  const navigateToIndex = useCallback(
    async ({
      index,
      content,
    }: {
      index: ExerciseState['index'];
      content: ExerciseSlide[];
    }) => {
      if (!sessionId || index < 0 || index > content.length - 1) {
        return;
      }

      const completed = index === content.length - 1 ? true : undefined;

      return sessionApi.updateExerciseState(sessionId, {
        index,
        playing: false,
        completed,
      });
    },
    [sessionId],
  );

  const setSpotlightParticipant = useCallback(
    async (dailySpotlightId: ExerciseState['dailySpotlightId']) => {
      if (sessionId) {
        return sessionApi.updateExerciseState(sessionId, {
          dailySpotlightId,
        });
      }
    },
    [sessionId],
  );

  const setPlaying = useCallback(
    async (playing: ExerciseState['playing']) => {
      if (sessionId) {
        return sessionApi.updateExerciseState(sessionId, {playing});
      }
    },
    [sessionId],
  );

  return {navigateToIndex, setSpotlightParticipant, setPlaying};
};
export default useUpdateSessionExerciseState;

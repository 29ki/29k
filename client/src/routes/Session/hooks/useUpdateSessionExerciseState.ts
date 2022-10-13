import {useCallback} from 'react';
import {ExerciseSlide} from '../../../../../shared/src/types/Content';
import {ExerciseState, Session} from '../../../../../shared/src/types/Session';
import * as sessionApi from '../../Sessions/api/session';

const useUpdateSessionExerciseState = (sessionId: Session['id']) => {
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

      return sessionApi.updateSessionExerciseState(sessionId, {
        index,
        playing: false,
      });
    },
    [sessionId],
  );

  const setSpotlightParticipant = useCallback(
    async (dailySpotlightId: ExerciseState['dailySpotlightId']) => {
      return sessionApi.updateSessionExerciseState(sessionId, {
        dailySpotlightId,
      });
    },
    [sessionId],
  );

  const setPlaying = useCallback(
    async (playing: ExerciseState['playing']) => {
      return sessionApi.updateSessionExerciseState(sessionId, {playing});
    },
    [sessionId],
  );

  return {navigateToIndex, setSpotlightParticipant, setPlaying};
};
export default useUpdateSessionExerciseState;

import {useCallback} from 'react';
import {ExerciseSlide} from '../../../../../shared/src/types/Content';
import {ExerciseState, Temple} from '../../../../../shared/src/types/Temple';
import * as templeApi from '../../Temples/api/temple';

const useUpdateTempleExerciseState = (templeId: Temple['id']) => {
  const navigateToIndex = useCallback(
    async ({
      index,
      content,
    }: {
      index: ExerciseState['index'];
      content: ExerciseSlide[];
    }) => {
      if (!templeId || index < 0 || index > content.length - 1) {
        return;
      }

      return templeApi.updateTempleExerciseState(templeId, {
        index,
        playing: false,
      });
    },
    [templeId],
  );

  const setSpotlightParticipant = useCallback(
    async (dailySpotlightId: ExerciseState['dailySpotlightId']) => {
      return templeApi.updateTempleExerciseState(templeId, {
        dailySpotlightId,
      });
    },
    [templeId],
  );

  const setPlaying = useCallback(
    async (playing: ExerciseState['playing']) => {
      return templeApi.updateTempleExerciseState(templeId, {playing});
    },
    [templeId],
  );

  const setEnded = useCallback(async () => {
    return templeApi.updateTempleExerciseState(templeId, {ended: true});
  }, [templeId]);

  return {navigateToIndex, setSpotlightParticipant, setPlaying, setEnded};
};
export default useUpdateTempleExerciseState;

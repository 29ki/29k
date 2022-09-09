import {useCallback} from 'react';
import {ContentSlide} from '../../../../../shared/src/types/Content';
import {Temple} from '../../../../../shared/src/types/Temple';
import * as templeApi from '../../Temples/api/temple';

const useUpdateTemple = (templeId: Temple['id']) => {
  const navigateToIndex = useCallback(
    async ({
      index,
      content,
    }: {
      index: Temple['index'];
      content: ContentSlide[];
    }) => {
      if (!templeId || index < 0 || index > content.length - 1) {
        return;
      }

      return templeApi.updateTemple(templeId, {index, playing: false});
    },
    [templeId],
  );

  const setActive = useCallback(
    async (active: Temple['active']) => {
      return templeApi.updateTemple(templeId, {active});
    },
    [templeId],
  );

  const setSpotlightParticipant = useCallback(
    async (dailyFacilitatorId: Temple['dailyFacilitatorId']) => {
      return templeApi.updateTemple(templeId, {dailyFacilitatorId});
    },
    [templeId],
  );

  const setPlaying = useCallback(
    async (playing: Temple['playing']) => {
      return templeApi.updateTemple(templeId, {playing});
    },
    [templeId],
  );

  return {navigateToIndex, setActive, setSpotlightParticipant, setPlaying};
};
export default useUpdateTemple;

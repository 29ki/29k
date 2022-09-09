import {useCallback} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useRecoilState} from 'recoil';
import {templeAtom} from '../state/state';
import {Temple} from '../../../../../shared/src/types/Temple';
import * as templeApi from '../../Temples/api/temple';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';

const useTemple = () => {
  const [temple, setTempleState] = useRecoilState(templeAtom);
  const content = useExerciseById(temple?.contentId);

  const subscribeTemple = useCallback(
    templeId => {
      const doc = firestore().collection('temples').doc(templeId);

      const unsubscribe = doc.onSnapshot(
        documentSnapshot => setTempleState(documentSnapshot.data() as Temple),
        error =>
          console.debug(
            `Failed to subscribe to live session ${templeId}`,
            error,
          ),
      );

      return unsubscribe;
    },
    [setTempleState],
  );

  const navigateToIndex = useCallback(
    async (index: Temple['index']) => {
      if (!temple?.id || index < 0 || index > content.length - 1) {
        return;
      }

      return templeApi.updateTemple(temple.id, {index, playing: false});
    },
    [temple?.id, content],
  );

  const setActive = useCallback(
    async (active: Temple['active']) => {
      if (!temple?.id) {
        return;
      }

      return templeApi.updateTemple(temple.id, {active});
    },
    [temple?.id],
  );

  const setPlaying = useCallback(
    async (playing: Temple['playing']) => {
      if (!temple?.id) {
        return;
      }

      return templeApi.updateTemple(temple.id, {playing});
    },
    [temple?.id],
  );

  const setDailyFacilitatorId = useCallback(
    async (dailyFacilitatorId: Temple['dailyFacilitatorId']) => {
      if (!temple?.id) {
        return;
      }

      return templeApi.updateTemple(temple.id, {dailyFacilitatorId});
    },
    [temple?.id],
  );

  return {
    subscribeTemple,
    navigateToIndex,
    setActive,
    setPlaying,
    setDailyFacilitatorId,
  };
};

export default useTemple;

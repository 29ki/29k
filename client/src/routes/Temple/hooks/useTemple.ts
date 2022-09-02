import {useCallback} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useRecoilState} from 'recoil';
import {templeAtom} from '../state/state';
import {Temple} from '../../../../../shared/src/types/Temple';
import * as templeApi from '../../Temples/api/temple';

const useTemple = () => {
  const [temple, setTempleState] = useRecoilState(templeAtom);

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
      const contentLength = 3; // get from content
      const invalidIndex = index < 0 || index > contentLength;

      if (!temple || invalidIndex) {
        return;
      }

      return templeApi.updateTemple(temple.id, {index, playing: false});
    },
    [temple],
  );

  const setActive = useCallback(
    async (active: Temple['active']) => {
      if (!temple) {
        return;
      }

      return templeApi.updateTemple(temple.id, {active});
    },
    [temple],
  );

  const setPlaying = useCallback(
    async (playing: Temple['playing']) => {
      if (!temple) {
        return;
      }

      return templeApi.updateTemple(temple.id, {playing});
    },
    [temple],
  );

  return {
    subscribeTemple,
    navigateToIndex,
    setActive,
    setPlaying,
  };
};

export default useTemple;

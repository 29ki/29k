import {useCallback} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useRecoilState} from 'recoil';
import {templeAtom} from '../state/state';
import {Temple} from '../../../../../shared/src/types/Temple';
import * as templeApi from '../../Temples/api/temple';
import useContentById from '../../../lib/content/hooks/useContentById';

const useTemple = () => {
  const [temple, setTempleState] = useRecoilState(templeAtom);
  const content = useContentById(temple?.contentId);

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
      if (!temple || index < 0 || index > content.length - 1) {
        return;
      }

      return templeApi.updateTemple(temple.id, {index, playing: false});
    },
    [temple, content],
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

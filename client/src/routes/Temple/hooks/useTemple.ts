import {useCallback} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useSetRecoilState} from 'recoil';
import {templeAtom} from '../state/state';
import {Temple} from '../../../../../shared/src/types/Temple';

const useTemple = () => {
  const setTempleState = useSetRecoilState(templeAtom);

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

  return {
    subscribeTemple,
  };
};

export default useTemple;

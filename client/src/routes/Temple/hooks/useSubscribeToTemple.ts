import {useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useSetRecoilState} from 'recoil';
import {templeAtom} from '../state/state';
import {Temple} from '../../../../../shared/src/types/Temple';

const useSubscribeToTemple = (templeId: Temple['id']) => {
  const setTempleState = useSetRecoilState(templeAtom);

  useEffect(() => {
    const doc = firestore().collection('temples').doc(templeId);

    const unsubscribe = doc.onSnapshot(
      documentSnapshot => setTempleState(documentSnapshot.data() as Temple),
      error =>
        console.debug(`Failed to subscribe to live session ${templeId}`, error),
    );

    return unsubscribe;
  }, [setTempleState, templeId]);
};

export default useSubscribeToTemple;

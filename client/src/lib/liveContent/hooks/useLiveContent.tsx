import firestore from '@react-native-firebase/firestore';
import {useEffect} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';

import {liveContentStateAtom, LiveContentState} from '../state/state';

const useLiveContent = (id: string): LiveContentState => {
  const setState = useSetRecoilState(liveContentStateAtom);

  useEffect(() => {
    const doc = firestore().collection('live-content-sessions').doc(id);
    const unsubscribe = doc.onSnapshot(
      documentSnapshot => setState(documentSnapshot.data() as LiveContentState),
      error =>
        console.debug(`Failed to subscribe to live session ${id}`, error),
    );

    return unsubscribe;
  }, [setState, id]);

  return useRecoilValue(liveContentStateAtom);
};

export default useLiveContent;

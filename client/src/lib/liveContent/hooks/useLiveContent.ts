import firestore from '@react-native-firebase/firestore';
import {useCallback} from 'react';
import {useSetRecoilState} from 'recoil';

import {liveContentStateAtom, LiveContentState} from '../state/state';

const useLiveContent = (id: string) => {
  const setState = useSetRecoilState(liveContentStateAtom);

  const subscribe = useCallback(() => {
    const doc = firestore().collection('live-content-sessions').doc(id);

    return doc.onSnapshot(
      documentSnapshot => setState(documentSnapshot.data() as LiveContentState),
      error =>
        console.debug(`Failed to subscribe to live session ${id}`, error),
    );
  }, [id, setState]);

  return subscribe;
};

export default useLiveContent;

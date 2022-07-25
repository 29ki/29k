import firestore from '@react-native-firebase/firestore';
import {useEffect} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';

import {sharingContentStateAtom, SharingContentState} from '../state/state';

const useSharingContent = (): SharingContentState => {
  const setState = useSetRecoilState(sharingContentStateAtom);

  useEffect(() => {
    const doc = firestore().collection('sharing').doc('some-sharing-id');
    doc.onSnapshot(documentSnapshot =>
      setState(documentSnapshot.data() as SharingContentState),
    );
  }, [setState]);

  return useRecoilValue(sharingContentStateAtom);
};

export default useSharingContent;

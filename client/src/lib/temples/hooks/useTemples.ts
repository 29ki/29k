import firestore from '@react-native-firebase/firestore';
import {useCallback} from 'react';
import {useRecoilState, useSetRecoilState} from 'recoil';
import * as templeApi from '../../api/temple';

import {
  contentStateAtom,
  ContentState,
  isLoadingAtom,
  templesAtom,
} from '../state/state';

const useTemples = () => {
  const setContentState = useSetRecoilState(contentStateAtom);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingAtom);
  const [temples, setTemples] = useRecoilState(templesAtom);

  const subscribeTemple = useCallback(
    async templeId => {
      const doc = await firestore()
        .collection('live-content-sessions')
        .doc(templeId);

      return doc.onSnapshot(
        documentSnapshot =>
          setContentState(documentSnapshot.data() as ContentState),
        error =>
          console.debug(
            `Failed to subscribe to live session ${templeId}`,
            error,
          ),
      );
    },
    [setContentState],
  );

  const fetchTemples = useCallback(async () => {
    setIsLoading(true);
    setTemples(await templeApi.fetchTemples());
    setIsLoading(false);
  }, [setIsLoading, setTemples]);

  const addTemple = useCallback(
    async templeName => {
      if (!templeName) {
        return;
      }

      await templeApi.addTemple(templeName);
      fetchTemples();
    },
    [fetchTemples],
  );

  return {
    fetchTemples,
    isLoading,
    addTemple,
    subscribeTemple,
    temples,
  };
};

export default useTemples;

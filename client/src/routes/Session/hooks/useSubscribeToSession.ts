import {useCallback} from 'react';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {Session} from '../../../../../shared/src/types/Session';

const useSubscribeToSession = (sessionId: Session['id']) => {
  return useCallback(
    (
      onSnapshot: (
        snapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
      ) => any,
    ) => {
      const doc = firestore().collection('sessions').doc(sessionId);

      const unsubscribe = doc.onSnapshot(onSnapshot, error =>
        console.debug(
          `Failed to subscribe to live session ${sessionId}`,
          error,
        ),
      );

      return unsubscribe;
    },
    [sessionId],
  );
};

export default useSubscribeToSession;

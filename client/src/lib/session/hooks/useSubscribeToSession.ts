import {useCallback} from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  SessionState,
  LiveSession,
  SessionStateSchema,
} from '../../../../../shared/src/types/Session';

const useSubscribeToSession = (sessionId: LiveSession['id']) => {
  return useCallback(
    (onSnapshot: (sessionState: SessionState | undefined) => any) => {
      const stateDoc = firestore()
        .collection('sessions')
        .doc(sessionId)
        .collection('state')
        .doc(sessionId);

      const unsubscribe = stateDoc.onSnapshot(
        snapshot => {
          if (!snapshot.exists) {
            onSnapshot(undefined);
          }
          onSnapshot(SessionStateSchema.validateSync(snapshot.data()));
        },
        error =>
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

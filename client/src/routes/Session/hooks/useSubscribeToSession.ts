import {useCallback} from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  SessionState,
  Session,
  SessionStateData,
} from '../../../../../shared/src/types/Session';
import {getData} from '../../../../../shared/src/modelUtils/firestore';
import {getSessionState} from '../../../../../shared/src/modelUtils/session';

const useSubscribeToSession = (sessionId: Session['id']) => {
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

          const sessionState = getSessionState(
            getData<SessionStateData>(snapshot),
          );

          onSnapshot(sessionState);
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

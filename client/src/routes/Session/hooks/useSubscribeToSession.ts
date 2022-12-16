import {useCallback} from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  SessionState,
  Session,
  SessionStateData,
  SessionData,
} from '../../../../../shared/src/types/Session';
import {getData} from '../../../../../shared/src/modelUtils/firestore';
import {
  getSession,
  getSessionState,
} from '../../../../../shared/src/modelUtils/session';

const useSubscribeToSession = (sessionId: Session['id']) => {
  return useCallback(
    (
      onSnapshot: (
        sessionState: SessionState | undefined,
        session: Session | undefined,
      ) => any,
    ) => {
      const sessionDoc = firestore().collection('sessions').doc(sessionId);
      const stateDoc = sessionDoc.collection('state').doc(sessionId);

      const sessionPromise = sessionDoc.get();

      const unsubscribe = stateDoc.onSnapshot(
        snapshot => {
          if (!snapshot.exists) {
            onSnapshot(undefined, undefined);
          }

          const sessionState = getSessionState(
            getData<SessionStateData>(snapshot),
          );

          sessionPromise
            .then(doc => getSession(getData<SessionData>(doc)))
            .then(session => onSnapshot(sessionState, session));
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

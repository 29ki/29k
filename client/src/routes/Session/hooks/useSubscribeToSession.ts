import {useCallback} from 'react';
import firestore from '@react-native-firebase/firestore';
import {Session, SessionData} from '../../../../../shared/src/types/Session';
import {getData} from '../../../../../shared/src/modelUtils/firestore';
import {getSession} from '../../../../../shared/src/modelUtils/session';

const useSubscribeToSession = (sessionId: Session['id']) => {
  return useCallback(
    (onSnapshot: (session: Session | undefined) => any) => {
      const doc = firestore().collection('sessions').doc(sessionId);

      const unsubscribe = doc.onSnapshot(
        snapshot => {
          if (!snapshot.exists) {
            onSnapshot(undefined);
          }

          const session = getSession(getData<SessionData>(snapshot));
          onSnapshot(session);
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

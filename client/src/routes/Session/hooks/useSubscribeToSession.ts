import {useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useSetRecoilState} from 'recoil';
import {sessionAtom} from '../state/state';
import {Session, SessionData} from '../../../../../shared/src/types/Session';

const useSubscribeToSession = (sessionId: Session['id']) => {
  const setSessionState = useSetRecoilState(sessionAtom);

  useEffect(() => {
    const doc = firestore().collection('sessions').doc(sessionId);

    const unsubscribe = doc.onSnapshot(
      documentSnapshot =>
        setSessionState(documentSnapshot.data() as SessionData),
      error =>
        console.debug(
          `Failed to subscribe to live session ${sessionId}`,
          error,
        ),
    );

    return unsubscribe;
  }, [setSessionState, sessionId]);
};

export default useSubscribeToSession;

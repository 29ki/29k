import {useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import useSessionState from '../state/state';
import {Session, SessionData} from '../../../../../shared/src/types/Session';
import useSessions from '../../Sessions/hooks/useSessions';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  ModalStackProps,
  TabNavigatorProps,
} from '../../../lib/navigation/constants/routes';

const useSubscribeToSession = (sessionId: Session['id']) => {
  const setSessionState = useSessionState(state => state.setState);

  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<TabNavigatorProps & ModalStackProps>
    >();

  const {fetchSessions} = useSessions();

  useEffect(() => {
    const doc = firestore().collection('sessions').doc(sessionId);

    const unsubscribe = doc.onSnapshot(
      documentSnapshot => {
        const session = documentSnapshot.data() as SessionData;

        if (!documentSnapshot.exists) {
          fetchSessions();
          navigate('Sessions');
          navigate('SessionUnavailableModal');
          return;
        }

        setSessionState(session);
      },
      error =>
        console.debug(
          `Failed to subscribe to live session ${sessionId}`,
          error,
        ),
    );

    return unsubscribe;
  }, [setSessionState, sessionId, navigate, fetchSessions]);
};

export default useSubscribeToSession;

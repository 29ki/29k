import {useEffect} from 'react';
import useSessionState from '../state/state';
import {Session, SessionData} from '../../../../../shared/src/types/Session';
import useSessions from '../../Sessions/hooks/useSessions';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  ModalStackProps,
  TabNavigatorProps,
} from '../../../lib/navigation/constants/routes';
import useSubscribeToSession from './useSubscribeToSession';

type Options = {exitOnEnded?: boolean};

const useSubscribeToSessionIfFocused = (
  sessionId: Session['id'],
  options?: Options,
) => {
  const {exitOnEnded = true} = options ?? {};
  const setSessionState = useSessionState(state => state.setState);
  const {fetchSessions} = useSessions();
  const subscribeToSession = useSubscribeToSession(sessionId);
  const isFocused = useIsFocused();

  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<TabNavigatorProps & ModalStackProps>
    >();

  useEffect(() => {
    if (isFocused) {
      return subscribeToSession(documentSnapshot => {
        const session = documentSnapshot.data() as SessionData;

        if (!documentSnapshot.exists || (exitOnEnded && session?.ended)) {
          fetchSessions();
          navigate('Sessions');
          navigate('SessionUnavailableModal');
          return;
        }

        setSessionState(session);
      });
    }
  }, [
    isFocused,
    subscribeToSession,
    exitOnEnded,
    fetchSessions,
    navigate,
    setSessionState,
  ]);

  useEffect(() => {}, [setSessionState, sessionId, navigate, fetchSessions]);
};

export default useSubscribeToSessionIfFocused;

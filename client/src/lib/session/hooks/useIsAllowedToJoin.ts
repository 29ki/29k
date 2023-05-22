import useSessionState from '../state/state';
import useSessions from '../../sessions/hooks/useSessions';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  ModalStackProps,
  TabNavigatorProps,
} from '../../navigation/constants/routes';
import {useCallback} from 'react';
import {getSession} from '../../sessions/api/session';
import {ValidateSessionError} from '../../../../../shared/src/errors/Session';

const ERROR_STATUES = Object.values(ValidateSessionError);

const useIsAllowedToJoin = () => {
  const reset = useSessionState(state => state.reset);
  const {fetchSessions} = useSessions();
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<TabNavigatorProps & ModalStackProps>
    >();

  const resetSession = useCallback(() => {
    reset();
    fetchSessions();
    navigate('HomeStack');
    navigate('SessionUnavailableModal');
  }, [reset, fetchSessions, navigate]);

  return useCallback(
    async (sessionId: string) => {
      try {
        // if the session is found, it's validated by the backend
        await getSession(sessionId);
        return true;
      } catch (e) {
        const error = e as Error;
        // Only reset session on known errors
        if (ERROR_STATUES.includes(error.message as ValidateSessionError)) {
          resetSession();
        }
        throw error;
      }
    },
    [resetSession],
  );
};

export default useIsAllowedToJoin;

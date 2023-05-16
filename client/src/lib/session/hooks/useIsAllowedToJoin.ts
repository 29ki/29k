import dayjs from 'dayjs';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
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
import useUser from '../../user/hooks/useUser';

const isSessionOpen = (session: LiveSessionType): boolean =>
  dayjs(session.closingTime).isAfter(dayjs());

const isUserAllowedToJoin = (session: LiveSessionType, userId: string) =>
  isSessionOpen(session) ||
  session.userIds.includes(userId) ||
  session.hostId === userId;

const useIsAllowedToJoin = () => {
  const user = useUser();
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
        const session = await getSession(sessionId);

        if (user?.uid && !isUserAllowedToJoin(session, user?.uid)) {
          resetSession();

          return false;
        }
        return true;
      } catch (error) {
        resetSession();
        throw error;
      }
    },
    [user?.uid, resetSession],
  );
};

export default useIsAllowedToJoin;

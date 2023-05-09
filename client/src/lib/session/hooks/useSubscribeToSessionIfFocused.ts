import {useEffect} from 'react';
import useSessionState from '../state/state';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import useSessions from '../../sessions/hooks/useSessions';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  ModalStackProps,
  TabNavigatorProps,
} from '../../navigation/constants/routes';
import useSubscribeToSession from './useSubscribeToSession';
import useGetExerciseById from '../../content/hooks/useGetExerciseById';

type Options = {exitOnEnded?: boolean};

const useSubscribeToSessionIfFocused = (
  session: LiveSessionType,
  options?: Options,
) => {
  const {exitOnEnded = true} = options ?? {};
  const getExerciseById = useGetExerciseById();
  const setSessionState = useSessionState(state => state.setSessionState);
  const setSession = useSessionState(state => state.setLiveSession);
  const setExercise = useSessionState(state => state.setExercise);
  const reset = useSessionState(state => state.reset);
  const {fetchSessions} = useSessions();
  const subscribeToSession = useSubscribeToSession(session.id);
  const isFocused = useIsFocused();

  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<TabNavigatorProps & ModalStackProps>
    >();

  useEffect(() => {
    setSession(session);
    const exercise = getExerciseById(session.exerciseId, session.language);
    setExercise({
      ...exercise,
      slides: exercise.slides.filter(s => s.type !== 'instruction'),
    });
  }, [session, setSession, setExercise, getExerciseById]);

  useEffect(() => {
    if (isFocused) {
      return subscribeToSession(sessionState => {
        if (!sessionState || !session || (exitOnEnded && sessionState?.ended)) {
          reset();
          fetchSessions();
          navigate('Home');
          navigate('SessionUnavailableModal');
          return;
        }

        setSessionState(sessionState);
      });
    }
  }, [
    isFocused,
    subscribeToSession,
    exitOnEnded,
    fetchSessions,
    navigate,
    reset,
    setSessionState,
    setSession,
    session,
  ]);
};

export default useSubscribeToSessionIfFocused;

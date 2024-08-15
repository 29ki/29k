import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import {useCallback} from 'react';
import {
  AsyncSessionType,
  SessionMode,
  SessionType,
} from '../../../../../shared/src/schemas/Session';
import useGetExerciseById from '../../content/hooks/useGetExerciseById';
import {
  AppStackProps,
  ModalStackProps,
} from '../../navigation/constants/routes';
import useLogAsyncSessionMetricEvents from '../../sessions/hooks/useLogAsyncSessionMetricEvents';
import {generateId} from '../../utils/id';
import useSessionState from '../state/state';

const useStartAsyncSession = () => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const setAsyncSession = useSessionState(state => state.setAsyncSession);
  const setExercise = useSessionState(state => state.setExercise);
  const getExerciseById = useGetExerciseById();
  const logAsyncSessionMetricEvent = useLogAsyncSessionMetricEvents();

  return useCallback(
    (exerciseId: string) => {
      const exercise = getExerciseById(exerciseId);

      if (!exercise) return;

      const session: AsyncSessionType = {
        type: SessionType.public,
        mode: SessionMode.async,
        id: generateId(),
        startTime: dayjs().toISOString(),
        exerciseId: exercise.id,
        language: exercise.language,
      };

      setAsyncSession(session);
      setExercise(exercise);
      navigate('AsyncSessionStack', {
        screen: 'IntroPortal',
        params: {
          session,
        },
      });
      logAsyncSessionMetricEvent('Create Async Session', session);
    },
    [
      navigate,
      logAsyncSessionMetricEvent,
      setAsyncSession,
      setExercise,
      getExerciseById,
    ],
  );
};

export default useStartAsyncSession;

import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {
  AsyncSession,
  SessionMode,
  SessionType,
} from '../../../../../shared/src/types/Session';
import {LANGUAGE_TAG} from '../../i18n';
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
  const {i18n} = useTranslation();
  const setAsyncSession = useSessionState(state => state.setAsyncSession);
  const logAsyncSessionMetricEvent = useLogAsyncSessionMetricEvents();

  return useCallback(
    (exerciseId: string) => {
      const session: AsyncSession = {
        type: SessionType.private,
        mode: SessionMode.async,
        id: generateId(),
        startTime: dayjs().toJSON(),
        exerciseId,
        language: i18n.resolvedLanguage as LANGUAGE_TAG,
      };
      setAsyncSession(session);
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
      i18n.resolvedLanguage,
    ],
  );
};

export default useStartAsyncSession;

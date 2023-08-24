import {useCallback, useContext, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import useDailyState from '../../daily/state/state';
import usePreventGoingBack from '../../navigation/hooks/usePreventGoingBack';
import useLeaveSession from './useLeaveSession';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  LiveSessionStackProps,
  ModalStackProps,
} from '../../navigation/constants/routes';
import {DailyContext} from '../../daily/DailyProvider';
import {ErrorBannerContext} from '../../contexts/ErrorBannerContext';
import {useTranslation} from 'react-i18next';

const useHandleLeaveLiveSession = (session: LiveSessionType) => {
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<LiveSessionStackProps & ModalStackProps>
    >();
  const {t} = useTranslation('Component.SessionError');
  const {leaveMeeting} = useContext(DailyContext);
  const errorBannerContext = useContext(ErrorBannerContext);
  const {leaveSessionWithConfirm, leaveSession} = useLeaveSession(session);
  const hasFailed = useDailyState(state => state.hasFailed);
  const isEjected = useDailyState(state => state.isEjected);
  const resetHasFailed = useDailyState(state => state.resetHasFailed);

  usePreventGoingBack(leaveSessionWithConfirm, hasFailed, isEjected);

  const rejoinMeeting = useCallback(async () => {
    await leaveMeeting();

    navigate('ChangingRoom', {
      session: session,
      isReJoining: true,
    });
    resetHasFailed();
  }, [leaveMeeting, resetHasFailed, navigate, session]);

  const ejectFromMeeting = useCallback(async () => {
    await leaveSession(true);
    navigate('SessionEjectionModal');
  }, [leaveSession, navigate]);

  useEffect(() => {
    if (isEjected) {
      ejectFromMeeting();
    } else if (hasFailed) {
      errorBannerContext?.showError(t('title'), t('message'), {
        disableAutoClose: true,
        actionConfig: {
          text: t('rejoinButton'),
          action: rejoinMeeting,
        },
      });
    }
  }, [
    hasFailed,
    isEjected,
    errorBannerContext,
    rejoinMeeting,
    ejectFromMeeting,
    t,
  ]);
};

export default useHandleLeaveLiveSession;

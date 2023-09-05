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
import useUser from '../../user/hooks/useUser';

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
  const hasEjected = useDailyState(state => state.hasEjected);
  const resetHasFailed = useDailyState(state => state.resetHasFailed);
  const user = useUser();

  usePreventGoingBack(leaveSessionWithConfirm, hasFailed, hasEjected);

  const rejoinMeeting = useCallback(async () => {
    await leaveMeeting();

    navigate('ChangingRoom', {
      session: session,
      isReJoining: true,
    });
    resetHasFailed();
  }, [leaveMeeting, resetHasFailed, navigate, session]);

  const ejectFromMeeting = useCallback(async () => {
    if (user?.uid) {
      await leaveSession(true);
      navigate('SessionErrorModal', {hasEjected: true});
    }
  }, [leaveSession, navigate, user?.uid]);

  useEffect(() => {
    if (hasEjected) {
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
    hasEjected,
    errorBannerContext,
    rejoinMeeting,
    ejectFromMeeting,
    t,
  ]);
};

export default useHandleLeaveLiveSession;

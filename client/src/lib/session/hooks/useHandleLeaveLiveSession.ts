import {useCallback, useContext, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import useDailyState from '../../daily/state/state';
import usePreventGoingBack from '../../navigation/hooks/usePreventGoingBack';
import useLeaveSession from './useLeaveSession';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {LiveSessionStackProps} from '../../navigation/constants/routes';
import {DailyContext} from '../../daily/DailyProvider';
import {ErrorBannerContext} from '../../contexts/ErrorBannerContext';
import {useTranslation} from 'react-i18next';

const useHandleLeaveLiveSession = (session: LiveSessionType) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<LiveSessionStackProps>>();
  const {t} = useTranslation('Component.SessionError');
  const {leaveMeeting} = useContext(DailyContext);
  const errorBannerContext = useContext(ErrorBannerContext);
  const {leaveSessionWithConfirm} = useLeaveSession(session);
  const hasFailed = useDailyState(state => state.hasFailed);
  const resetHasFailed = useDailyState(state => state.resetHasFailed);

  usePreventGoingBack(leaveSessionWithConfirm, hasFailed);

  const rejoinMeeting = useCallback(async () => {
    await leaveMeeting();

    navigate('ChangingRoom', {
      session: session,
      isReJoining: true,
    });
    resetHasFailed();
  }, [leaveMeeting, resetHasFailed, navigate, session]);

  useEffect(() => {
    if (hasFailed) {
      errorBannerContext?.showError(t('title'), t('message'), {
        disableAutoClose: true,
        actionConfig: {
          text: t('rejoinButton'),
          action: rejoinMeeting,
        },
      });
    }
  }, [hasFailed, errorBannerContext, rejoinMeeting, t]);
};

export default useHandleLeaveLiveSession;

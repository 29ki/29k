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

const useHandleLeaveLiveSession = (session: LiveSessionType) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<LiveSessionStackProps>>();
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
      errorBannerContext?.showError(
        'Session Error',
        'Pleace rejoin the session',
        {
          disableAutoClose: true,
          actionConfig: {
            text: 'Rejoin',
            action: rejoinMeeting,
          },
        },
      );
    }
  }, [hasFailed, errorBannerContext, rejoinMeeting]);
};

export default useHandleLeaveLiveSession;

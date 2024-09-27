import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useCallback, useState} from 'react';
import {AsyncSessionStackProps} from '../../../lib/navigation/constants/routes';
import useLeaveSession from '../../../lib/session/hooks/useLeaveSession';
import usePreventGoingBack from '../../../lib/navigation/hooks/usePreventGoingBack';
import IntroPortalComponent from '../../../lib/session/components/IntroPortal/IntroPortal';
import useUpdateAsyncSessionState from '../../../lib/session/hooks/useUpdateAsyncSessionState';
import useAsyncSessionMetricEvents from '../../../lib/session/hooks/useAsyncSessionMetricEvents';
import useSessionState from '../../../lib/session/state/state';
import useConfirmLogMindfulMinutes from '../../../lib/mindfulMinutes/hooks/useConfirmLogMindfulMinutes';
import Screen from '../../../lib/components/Screen/Screen';
import {StatusBar} from 'react-native';
import {
  BottomSafeArea,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';
import {SPACINGS} from '../../../lib/constants/spacings';
import {COLORS} from '../../../../../shared/src/constants/colors';

const IntroPortal = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<AsyncSessionStackProps, 'IntroPortal'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<AsyncSessionStackProps>>();

  const exercise = useSessionState(state => state.exercise);
  const {startSession} = useUpdateAsyncSessionState(session);
  const {leaveSessionWithConfirm} = useLeaveSession(session);
  const [isVisible, setIsVisible] = useState(true);
  const logSessionMetricEvent = useAsyncSessionMetricEvents();
  const confirmLogMindfulMinutes = useConfirmLogMindfulMinutes();

  usePreventGoingBack(leaveSessionWithConfirm);

  useEffect(
    () =>
      navigation.addListener('transitionEnd', ({data}) => {
        setIsVisible(data.closing === false);
      }),
    [navigation],
  );

  useEffect(() => {
    logSessionMetricEvent('Enter Intro Portal');
    confirmLogMindfulMinutes();
  }, [logSessionMetricEvent, confirmLogMindfulMinutes]);

  const onStartSession = useCallback(() => {
    startSession();
    logSessionMetricEvent('Start Sharing Session');
  }, [startSession, logSessionMetricEvent]);

  const navigateToSession = useCallback(
    () => navigation.navigate('Session', {session}),
    [navigation, session],
  );

  const textColor =
    exercise?.introPortal?.textColor || exercise?.theme?.textColor;

  return (
    <Screen backgroundColor={exercise?.theme?.backgroundColor}>
      <StatusBar
        barStyle={textColor === COLORS.WHITE ? 'light-content' : 'dark-content'}
      />
      <TopSafeArea minSize={SPACINGS.SIXTEEN} />
      <IntroPortalComponent
        exercise={exercise}
        isVisible={isVisible}
        isHost={true}
        hideHostNotes={true}
        onStartSession={onStartSession}
        onLeaveSession={leaveSessionWithConfirm}
        onNavigateToSession={navigateToSession}
      />
      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </Screen>
  );
};

export default IntroPortal;

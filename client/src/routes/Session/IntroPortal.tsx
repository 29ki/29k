import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import Video from 'react-native-video';
import styled from 'styled-components/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import Button from '../../lib/components/Buttons/Button';
import Gutters from '../../lib/components/Gutters/Gutters';
import {
  BottomSafeArea,
  Spacer16,
  Spacer8,
  TopSafeArea,
} from '../../lib/components/Spacers/Spacer';
import {Body14} from '../../lib/components/Typography/Body/Body';
import {COLORS} from '../../../../shared/src/constants/colors';
import {HKGroteskBold} from '../../lib/constants/fonts';
import {
  ModalStackProps,
  SessionStackProps,
  TabNavigatorProps,
} from '../../lib/navigation/constants/routes';
import {SPACINGS} from '../../lib/constants/spacings';
import useSessionState from './state/state';
import useDailyState from '../../lib/daily/state/state';
import useLeaveSession from './hooks/useLeaveSession';
import VideoBase from './components/VideoBase/VideoBase';
import LottiePlayer from '../../lib/components/LottiePlayer/LottiePlayer';
import useIsSessionHost from './hooks/useIsSessionHost';
import usePreventGoingBack from '../../lib/navigation/hooks/usePreventGoingBack';
import useUpdateSessionState from './hooks/useUpdateSessionState';
import HostNotes from './components/HostNotes/HostNotes';
import Screen from '../../lib/components/Screen/Screen';
import IconButton from '../../lib/components/Buttons/IconButton/IconButton';
import {ArrowLeftIcon} from '../../lib/components/Icons';
import useSubscribeToSessionIfFocused from './hooks/useSusbscribeToSessionIfFocused';
import Badge from '../../lib/components/Badge/Badge';
import useSessionStartTime from './hooks/useSessionStartTime';
import useSessionExercise from './hooks/useSessionExercise';
import AudioFader from './components/AudioFader/AudioFader';
import useLogInSessionMetricEvents from './hooks/useLogInSessionMetricEvents';
import LottiePlayerAnimated from '../../lib/components/LottiePlayer/LottiePlayerAnimated';

const VideoStyled = styled(VideoBase)({
  ...StyleSheet.absoluteFillObject,
});

const LottieStyled = styled(LottiePlayer)({
  ...StyleSheet.absoluteFillObject,
});

const LottieAnimatedStyled = styled(LottiePlayerAnimated)({
  ...StyleSheet.absoluteFillObject,
});

const StatusItem = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const StatusText = styled(Body14)<{themeColor?: string}>(({themeColor}) => ({
  color: themeColor ? themeColor : COLORS.PURE_WHITE,
  fontFamily: HKGroteskBold,
}));

const PortalStatus = styled(Gutters)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Wrapper = styled.View({
  flex: 1,
  justifyContent: 'space-between',
});
const Content = styled.View({
  flex: 1,
  justifyContent: 'space-between',
});

const TopBar = styled(Gutters)({
  justifyContent: 'space-between',
  flexDirection: 'row',
});

const BackButton = styled(IconButton)({
  marginLeft: -SPACINGS.SIXTEEN,
});

const Status: React.FC = () => {
  const {t} = useTranslation('Screen.Portal');
  const exercise = useSessionExercise();
  const textColor = exercise?.theme?.textColor;
  const sessionState = useSessionState(state => state.sessionState);
  const startTime = useSessionState(state => state.session?.startTime);
  const sessionTime = useSessionStartTime(dayjs(startTime));
  const started = sessionState?.started;
  const participants = useDailyState(state => state.participants);
  const participantsCount = Object.keys(participants ?? {}).length;

  return (
    <PortalStatus>
      <StatusItem>
        <StatusText themeColor={textColor}>
          {sessionTime.isStartingShortly
            ? t('counterLabel.starts')
            : t('counterLabel.startsIn')}
        </StatusText>
        <Spacer8 />

        <Badge
          themeColor={textColor ?? textColor}
          text={
            started
              ? t('counterLabel.started')
              : sessionTime.isStartingShortly
              ? t('counterLabel.shortly')
              : sessionTime.time
          }
        />
      </StatusItem>

      {participantsCount > 1 && (
        <StatusItem>
          <StatusText themeColor={textColor}>{t('participants')}</StatusText>
          <Spacer8 />
          <Badge themeColor={textColor} text={participantsCount} />
        </StatusItem>
      )}
    </PortalStatus>
  );
};

const IntroPortal: React.FC = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<SessionStackProps, 'IntroPortal'>>();
  const endVideoRef = useRef<Video>(null);
  const [joiningSession, setJoiningSession] = useState(false);
  const {t} = useTranslation('Screen.Portal');

  const sessionState = useSessionState(state => state.sessionState);
  const exercise = useSessionExercise();
  const [loopContentLoaded, setLoopContentLoaded] = useState(
    Boolean(exercise?.introPortal?.lottieLoop?.source),
  );

  const isHost = useIsSessionHost();
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<
        SessionStackProps & TabNavigatorProps & ModalStackProps
      >
    >();
  const {startSession} = useUpdateSessionState(session.id);
  const {leaveSessionWithConfirm} = useLeaveSession();
  const isFocused = useIsFocused();
  useSubscribeToSessionIfFocused(session);

  const logSessionMetricEvent = useLogInSessionMetricEvents();
  const introPortal = exercise?.introPortal;
  const textColor = exercise?.theme?.textColor;

  usePreventGoingBack(leaveSessionWithConfirm);

  useEffect(() => {
    if (sessionState?.id) {
      logSessionMetricEvent('Enter Intro Portal');
    }
  }, [logSessionMetricEvent, sessionState?.id]);

  const navigateToSession = useCallback(
    () => navigate('Session', {session}),
    [navigate, session],
  );

  useEffect(() => {
    if (
      sessionState?.started &&
      !endVideoRef.current &&
      !introPortal?.videoEnd?.source
    ) {
      // If no video is defined, navigate directly
      navigateToSession();
    }
  }, [sessionState?.started, introPortal?.videoEnd, navigateToSession]);

  const onStartPress = useCallback(() => {
    startSession();
    if (sessionState?.id) {
      logSessionMetricEvent('Start Sharing Session');
    }
  }, [startSession, logSessionMetricEvent, sessionState?.id]);

  const onEndVideoLoad = () => {
    endVideoRef.current?.seek(0);
  };

  const onEndContentEnd = () => {
    console.log('END!!!!', joiningSession);

    if (joiningSession) {
      navigateToSession();
    }
  };

  const onLoopVideoLoad = () => {
    setLoopContentLoaded(true);
  };

  const onLoopContentEnd = () => {
    if (sessionState?.started) {
      ReactNativeHapticFeedback.trigger('impactHeavy');
      setJoiningSession(true);
    }
  };

  const audioSource = useMemo(
    () => introPortal?.lottieLoop?.audio ?? introPortal?.videoLoop?.audio,
    [introPortal?.lottieLoop, introPortal?.videoLoop],
  );

  const endVideoSource = useMemo(
    () => introPortal?.videoEnd && {uri: introPortal.videoEnd?.source},
    [introPortal?.videoEnd],
  );

  const loopVideoSource = useMemo(
    () => introPortal?.videoLoop && {uri: introPortal.videoLoop?.source},
    [introPortal?.videoLoop],
  );

  const loopLottieSource = useMemo(
    () =>
      introPortal?.lottieLoop?.source && {uri: introPortal.lottieLoop?.source},
    [introPortal?.lottieLoop],
  );

  const endLottieSource = useMemo(
    () =>
      introPortal?.lottieEnd?.source && {uri: introPortal.lottieEnd?.source},
    [introPortal?.lottieEnd],
  );

  return (
    <Screen>
      {!isHost && <TopSafeArea minSize={SPACINGS.SIXTEEN} />}
      {isFocused && loopContentLoaded && audioSource && (
        <AudioFader
          source={audioSource}
          paused={!loopContentLoaded}
          volume={joiningSession ? 0 : 1}
          duration={joiningSession ? 5000 : 10000}
          repeat
        />
      )}

      {endLottieSource && (
        <LottieStyled
          onEnd={onEndContentEnd}
          paused={!joiningSession || !isFocused}
          source={endLottieSource}
          repeat={false}
          duration={introPortal?.lottieEnd?.duration ?? 5}
        />
      )}
      {!endLottieSource && endVideoSource && (
        <VideoStyled
          ref={endVideoRef}
          onReadyForDisplay={onEndVideoLoad}
          onEnd={onEndContentEnd}
          paused={!joiningSession || !isFocused}
          source={endVideoSource}
          resizeMode="cover"
          poster={introPortal?.videoEnd?.preview}
          posterResizeMode="cover"
        />
      )}

      {!joiningSession && loopLottieSource && (
        <LottieAnimatedStyled
          onEnd={onLoopContentEnd}
          paused={!isFocused}
          repeat={!sessionState?.started}
          source={loopLottieSource}
          duration={introPortal?.lottieLoop?.duration ?? 5}
        />
      )}

      {!joiningSession && !loopLottieSource && loopVideoSource && (
        <VideoStyled
          onReadyForDisplay={onLoopVideoLoad}
          onEnd={onLoopContentEnd}
          paused={!isFocused}
          repeat={!sessionState?.started}
          source={loopVideoSource}
          resizeMode="cover"
          poster={introPortal?.videoLoop?.preview}
          posterResizeMode="cover"
        />
      )}

      {isHost && (
        <>
          <HostNotes introPortal />
          <Spacer16 />
        </>
      )}
      <Wrapper>
        {isFocused && (
          <Content>
            <TopBar>
              <BackButton
                onPress={leaveSessionWithConfirm}
                fill={textColor}
                Icon={ArrowLeftIcon}
                noBackground
              />
              {__DEV__ && sessionState?.started && (
                <Button small onPress={navigateToSession}>
                  {t('skipPortal')}
                </Button>
              )}
              {isHost && (
                <Button
                  small
                  disabled={sessionState?.started}
                  onPress={onStartPress}>
                  {sessionState?.started
                    ? t('sessionStarted')
                    : t('startSession')}
                </Button>
              )}
            </TopBar>
            <Status />
          </Content>
        )}
      </Wrapper>
      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </Screen>
  );
};

export default IntroPortal;

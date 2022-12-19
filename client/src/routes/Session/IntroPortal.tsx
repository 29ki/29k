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

import * as metrics from '../../lib/metrics';
import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import {
  BottomSafeArea,
  Spacer16,
  Spacer8,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {Body14} from '../../common/components/Typography/Body/Body';
import {COLORS} from '../../../../shared/src/constants/colors';
import {HKGroteskBold} from '../../common/constants/fonts';
import {
  ModalStackProps,
  SessionStackProps,
  TabNavigatorProps,
} from '../../lib/navigation/constants/routes';
import {SPACINGS} from '../../common/constants/spacings';
import useSessionState from './state/state';
import useDailyState from '../../lib/daily/state/state';
import useLeaveSession from './hooks/useLeaveSession';
import VideoBase from './components/VideoBase/VideoBase';
import useIsSessionHost from './hooks/useIsSessionHost';
import usePreventGoingBack from '../../lib/navigation/hooks/usePreventGoingBack';
import useUpdateSession from './hooks/useUpdateSession';
import HostNotes from './components/HostNotes/HostNotes';
import Screen from '../../common/components/Screen/Screen';
import IconButton from '../../common/components/Buttons/IconButton/IconButton';
import {ArrowLeftIcon} from '../../common/components/Icons';
import useSubscribeToSessionIfFocused from './hooks/useSusbscribeToSessionIfFocused';
import Badge from '../../common/components/Badge/Badge';
import useSessionStartTime from './hooks/useSessionStartTime';
import useExerciseById from '../../lib/content/hooks/useExerciseById';
import AudioFader from './components/AudioFader/AudioFader';

const VideoStyled = styled(VideoBase)({
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

const IntroPortal: React.FC = () => {
  const {
    params: {sessionId: sessionId},
  } = useRoute<RouteProp<SessionStackProps, 'IntroPortal'>>();
  const endVideoRef = useRef<Video>(null);
  const [loopVideoLoaded, setLoopVideoLoaded] = useState(false);
  const [joiningSession, setJoiningSession] = useState(false);
  const {t} = useTranslation('Screen.Portal');
  const session = useSessionState(state => state.session);
  const exercise = useExerciseById(session?.contentId);
  const participants = useDailyState(state => state.participants);
  const participantsCount = Object.keys(participants ?? {}).length;
  const isHost = useIsSessionHost();
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<
        SessionStackProps & TabNavigatorProps & ModalStackProps
      >
    >();
  const {setStarted} = useUpdateSession(sessionId);
  const {leaveSessionWithConfirm} = useLeaveSession();
  const isFocused = useIsFocused();
  useSubscribeToSessionIfFocused(sessionId);
  const sessionTime = useSessionStartTime(dayjs(session?.startTime));

  const introPortal = exercise?.introPortal;
  const textColor = exercise?.theme?.textColor;
  const started = session?.started;

  usePreventGoingBack(leaveSessionWithConfirm);

  useEffect(() => {
    if (session?.id) {
      metrics.logEvent('Enter Intro Portal', {
        'Sharing Session ID': session.id,
        'Sharing Session Type': session.type,
        'Sharing Session Start Time': session.startTime,
        'Exercise ID': session.contentId,
        Host: isHost,
        Language: session.language,
      });
    }
  }, [
    session?.id,
    session?.type,
    session?.startTime,
    session?.contentId,
    session?.language,
    isHost,
  ]);

  const navigateToSession = useCallback(
    () => navigate('Session', {sessionId: sessionId}),
    [navigate, sessionId],
  );

  useEffect(() => {
    if (session?.started && !endVideoRef.current) {
      // If no video is defined, navigate directly
      navigateToSession();
    }
  }, [session?.started, navigateToSession]);

  const onStartPress = useCallback(() => {
    setStarted();
    if (session?.id) {
      metrics.logEvent('Start Sharing Session', {
        'Sharing Session ID': session.id,
        'Sharing Session Type': session.type,
        'Sharing Session Start Time': session.startTime,
        'Exercise ID': session.contentId,
        Host: true,
        Language: session.language,
      });
    }
  }, [
    session?.id,
    session?.type,
    session?.startTime,
    session?.contentId,
    session?.language,
    setStarted,
  ]);

  const onEndVideoLoad = () => {
    endVideoRef.current?.seek(0);
  };

  const onEndVideoEnd = () => {
    if (joiningSession) {
      navigateToSession();
    }
  };

  const onLoopVideoLoad = () => {
    setLoopVideoLoaded(true);
  };

  const onLoopVideoEnd = () => {
    if (session?.started) {
      ReactNativeHapticFeedback.trigger('impactHeavy');
      setJoiningSession(true);
    }
  };

  const endVideoSource = useMemo(
    () => introPortal?.videoEnd && {uri: introPortal.videoEnd?.source},
    [introPortal?.videoEnd],
  );

  const loopVideoSource = useMemo(
    () => introPortal?.videoLoop && {uri: introPortal.videoLoop?.source},
    [introPortal?.videoLoop],
  );

  return (
    <Screen>
      {!isHost && <TopSafeArea minSize={SPACINGS.SIXTEEN} />}
      {isFocused && loopVideoLoaded && introPortal?.videoLoop?.audio && (
        <AudioFader
          source={introPortal?.videoLoop?.audio}
          paused={!loopVideoLoaded}
          volume={joiningSession ? 0 : 1}
          duration={joiningSession ? 5000 : 10000}
          repeat
        />
      )}
      {endVideoSource && (
        <VideoStyled
          ref={endVideoRef}
          onReadyForDisplay={onEndVideoLoad}
          onEnd={onEndVideoEnd}
          paused={!joiningSession || !isFocused}
          source={endVideoSource}
          resizeMode="cover"
          poster={introPortal?.videoEnd?.preview}
          posterResizeMode="cover"
        />
      )}

      {!joiningSession && loopVideoSource && (
        <VideoStyled
          onReadyForDisplay={onLoopVideoLoad}
          onEnd={onLoopVideoEnd}
          paused={!isFocused}
          repeat={!session?.started}
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
              {__DEV__ && session?.started && (
                <Button small onPress={navigateToSession}>
                  {t('skipPortal')}
                </Button>
              )}
              {isHost && (
                <Button
                  small
                  disabled={session?.started}
                  onPress={onStartPress}>
                  {session?.started ? t('sessionStarted') : t('startSession')}
                </Button>
              )}
            </TopBar>

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
                  <StatusText themeColor={textColor}>
                    {t('participants')}
                  </StatusText>
                  <Spacer8 />
                  <Badge themeColor={textColor} text={participantsCount} />
                </StatusItem>
              )}
            </PortalStatus>
          </Content>
        )}
      </Wrapper>
      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </Screen>
  );
};

export default IntroPortal;

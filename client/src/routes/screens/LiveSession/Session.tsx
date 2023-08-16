import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {LayoutChangeEvent, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {SPACINGS} from '../../../lib/constants/spacings';
import {COLORS} from '../../../../../shared/src/constants/colors';

import {DailyUserData} from '../../../../../shared/src/schemas/Session';
import {LiveSessionStackProps} from '../../../lib/navigation/constants/routes';
import {DailyContext} from '../../../lib/daily/DailyProvider';

import useSessionState from '../../../lib/session/state/state';
import useSessionParticipants from '../../../lib/session/hooks/useSessionParticipants';
import useLiveSessionSlideState from '../../../lib/session/hooks/useLiveSessionSlideState';
import usePreventGoingBack from '../../../lib/navigation/hooks/usePreventGoingBack';
import useLeaveSession from '../../../lib/session/hooks/useLeaveSession';
import useIsSessionHost from '../../../lib/session/hooks/useIsSessionHost';
import useLocalParticipant from '../../../lib/daily/hooks/useLocalParticipant';
import useUser from '../../../lib/user/hooks/useUser';
import useSubscribeToSessionIfFocused from '../../../lib/session/hooks/useSubscribeToSessionIfFocused';
import useUpdateSessionState from '../../../lib/session/hooks/useUpdateSessionState';
import useLiveSessionMetricEvents from '../../../lib/session/hooks/useLiveSessionMetricEvents';
import useCheckPermissions from '../../../lib/session/hooks/useCheckPermissions';
import useAddUserEvent from '../../../lib/user/hooks/useAddUserEvent';

import {
  BottomSafeArea,
  Spacer12,
  Spacer16,
  Spacer32,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';

import ExerciseSlides from '../../../lib/session/components/ExerciseSlides/ExerciseSlides';
import Participants from '../../../lib/session/components/Participants/Participants';
import ProgressBar from '../../../lib/session/components/ProgressBar/ProgressBar';
import ContentControls from '../../../lib/session/components/ContentControls/ContentControls';
import IconButton from '../../../lib/components/Buttons/IconButton/IconButton';
import {
  FilmCameraIcon,
  FilmCameraOffIcon,
  HangUpIcon,
  HeartFillIcon,
  MicrophoneIcon,
  MicrophoneOffIcon,
} from '../../../lib/components/Icons';
import Button from '../../../lib/components/Buttons/Button';
import HostNotes from '../../../lib/session/components/HostNotes/HostNotes';
import Screen from '../../../lib/components/Screen/Screen';
import useMuteAudio from '../../../lib/session/hooks/useMuteAudio';
import ContentWrapper from '../../../lib/session/components/ContentWrapper/ContentWrapper';
import AutoScrollView from '../../../lib/components/AutoScrollView/AutoScrollView';
import SessionNotifications from '../../../lib/session/components/Notifications/SessionNotifications';
import useSendReaction from '../../../lib/session/hooks/useSendReaction';
import SessionReactions from '../../../lib/session/components/Reactions/SessionReactions';
import {ProgressTimerContext} from '../../../lib/session/context/TimerContext';
import DurationTimer from '../../../lib/session/components/DurationTimer/DurationTimer';
import {LottiePlayerHandle} from '../../../lib/components/LottiePlayer/LottiePlayer';

const ExerciseControl = styled(ContentControls)({
  position: 'absolute',
  bottom: SPACINGS.SIXTEEN,
  left: SPACINGS.SIXTEEN,
  right: SPACINGS.SIXTEEN,
  zIndex: 1000,
});

const SessionControls = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
});

const Progress = styled(ProgressBar)({
  position: 'absolute',
  left: SPACINGS.SIXTEEN,
  right: SPACINGS.FIFTYTWO,
  top: SPACINGS.EIGHT,
  zIndex: 1,
});

const Top = styled.View({
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  zIndex: 1000,
});

const ContentDurationTimerWrapper = styled.View<{top: number}>(({top}) => ({
  position: 'absolute',
  right: SPACINGS.SIXTEEN,
  top: Math.max(top, SPACINGS.SIXTEEN),
}));

const ContentDurationTimer = styled(DurationTimer)({
  width: 22,
  height: 22,
});

const StyledButton = styled(Button)({
  alignSelf: 'flex-end',
  marginRight: SPACINGS.SIXTEEN,
});

const StyledHangUpIcon = () => <HangUpIcon fill={COLORS.ACTIVE} />;

const Notifications = styled(SessionNotifications)({
  position: 'absolute',
  minHeight: 1000,
  left: 0,
  right: 0,
  bottom: '100%',
  padding: SPACINGS.EIGHT,
  paddingBottom: SPACINGS.TWENTYFOUR,
  overflow: 'hidden',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
});

const Reactions = styled(SessionReactions)({
  position: 'absolute',
  minHeight: 1000,
  left: 0,
  right: 0,
  bottom: '100%',
  padding: SPACINGS.EIGHT,
  paddingBottom: SPACINGS.TWENTYFOUR,
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'flex-end',
});

const Session: React.FC = () => {
  const {
    setUserData,
    toggleAudio,
    toggleVideo,
    setSubscribeToAllTracks,
    leaveMeeting,
  } = useContext(DailyContext);
  const {
    params: {session},
  } = useRoute<RouteProp<LiveSessionStackProps, 'Session'>>();
  const {navigate} =
    useNavigation<NativeStackNavigationProp<LiveSessionStackProps>>();
  const {t} = useTranslation('Screen.Session');
  useSubscribeToSessionIfFocused(session, {exitOnEnded: false});

  const top = useSafeAreaInsets().top;
  const scrollView = useRef<ScrollView>(null);
  const timerRef = useRef<LottiePlayerHandle>(null);
  const [contentDuration, setContentDuration] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const exercise = useSessionState(state => state.exercise);
  const participants = useSessionParticipants();
  const {endSession} = useUpdateSessionState(session.id);
  const me = useLocalParticipant();
  const isHost = useIsSessionHost();
  const sessionState = useSessionState(state => state.sessionState);
  const theme = useSessionState(state => state.exercise?.theme);
  const currentContentReachedEnd = useSessionState(
    state => state.currentContentReachedEnd,
  );
  const setCurrentContentReachedEnd = useSessionState(
    state => state.setCurrentContentReachedEnd,
  );
  const sessionSlideState = useLiveSessionSlideState();
  const logSessionMetricEvent = useLiveSessionMetricEvents();
  const {leaveSessionWithConfirm} = useLeaveSession(session);
  const {checkCameraPermissions, checkMicrophonePermissions} =
    useCheckPermissions();
  const user = useUser();
  const addUserEvent = useAddUserEvent();
  const sendReaction = useSendReaction();
  const {navigateToIndex, setPlaying} = useUpdateSessionState(session.id);
  const {conditionallyMuteParticipants} = useMuteAudio();

  const hasAudio = Boolean(me?.audioTrack);
  const hasVideo = Boolean(me?.videoTrack);

  usePreventGoingBack(leaveSessionWithConfirm);

  useEffect(() => {
    if (sessionState?.id) {
      logSessionMetricEvent('Enter Sharing Session');
    }
  }, [logSessionMetricEvent, sessionState?.id]);

  useEffect(() => {
    if (sessionState?.completed) {
      addUserEvent('completedSession', {
        id: sessionState?.id,
        hostId: session.hostId,
        type: session.type,
        mode: session.mode,
        language: session.language,
        exerciseId: session.exerciseId,
      });
      logSessionMetricEvent('Complete Sharing Session');
    }
  }, [
    sessionState?.completed,
    sessionState?.id,
    session,
    logSessionMetricEvent,
    addUserEvent,
  ]);

  useEffect(() => {
    if (sessionState?.ended) {
      leaveMeeting().then(() => navigate('OutroPortal', {session}));
    }
  }, [sessionState?.ended, navigate, leaveMeeting, session]);

  useEffect(() => {
    setUserData({
      inPortal: false,
      photoURL: user?.photoURL,
    } as DailyUserData);
    setSubscribeToAllTracks();
  }, [setUserData, setSubscribeToAllTracks, user?.photoURL]);

  useEffect(() => {
    scrollView.current?.scrollTo({y: 0, animated: true});
  }, [sessionSlideState?.index]);

  const onHeartPress = useCallback(() => {
    sendReaction('heart');
  }, [sendReaction]);

  const toggleAudioPress = useCallback(() => {
    checkMicrophonePermissions(() => {
      toggleAudio(!hasAudio);
    });
  }, [checkMicrophonePermissions, toggleAudio, hasAudio]);

  const toggleVideoPress = useCallback(() => {
    checkCameraPermissions(() => {
      toggleVideo(!hasVideo);
    });
  }, [checkCameraPermissions, toggleVideo, hasVideo]);

  const onPrevPress = useCallback(() => {
    if (sessionSlideState && exercise?.slides) {
      navigateToIndex({
        index: sessionSlideState.index - 1,
        content: exercise?.slides,
      });
    }
  }, [sessionSlideState, exercise?.slides, navigateToIndex]);

  const onNextPress = useCallback(() => {
    if (sessionSlideState && exercise?.slides) {
      navigateToIndex({
        index: sessionSlideState.index + 1,
        content: exercise?.slides,
      });
    }
  }, [sessionSlideState, exercise?.slides, navigateToIndex]);

  const onResetPlayingPress = useCallback(() => {
    setPlaying(Boolean(sessionState?.playing));
    setCurrentContentReachedEnd(false);
  }, [sessionState?.playing, setPlaying, setCurrentContentReachedEnd]);

  const onTogglePlayingPress = useCallback(() => {
    if (currentContentReachedEnd) {
      setPlaying(true);
      setCurrentContentReachedEnd(false);
      conditionallyMuteParticipants(true, sessionSlideState?.current);
    } else {
      const playing = !sessionState?.playing;
      setPlaying(playing);
      conditionallyMuteParticipants(playing, sessionSlideState?.current);
    }
  }, [
    sessionState?.playing,
    sessionSlideState,
    setPlaying,
    currentContentReachedEnd,
    setCurrentContentReachedEnd,
    conditionallyMuteParticipants,
  ]);

  const onScrollLayout = useCallback((event: LayoutChangeEvent) => {
    setScrollHeight(event.nativeEvent.layout.height);
  }, []);

  const showTimerProgress = useMemo(() => {
    const current = sessionSlideState?.current;
    return (
      current &&
      (current.type === 'content' ||
        current.type === 'reflection' ||
        current.type === 'sharing') &&
      (current.content?.video?.durationTimer ||
        (current.content?.lottie?.durationTimer &&
          (current.content.lottie.duration || current.content.lottie.audio)))
    );
  }, [sessionSlideState]);

  const onContentTimerLoad = useCallback((duration: number) => {
    setContentDuration(Math.ceil(duration));
    timerRef.current?.seek(0);
  }, []);

  const onContentTimerSeek = useCallback((currentTime: number) => {
    timerRef.current?.seek(currentTime);
  }, []);

  const contextProps = useMemo(
    () => ({
      onLoad: onContentTimerLoad,
      onSeek: onContentTimerSeek,
    }),
    [onContentTimerLoad, onContentTimerSeek],
  );
  return (
    <ProgressTimerContext.Provider value={contextProps}>
      <Screen backgroundColor={theme?.backgroundColor}>
        {isHost && (
          <Top>
            <HostNotes exercise={exercise}>
              {showTimerProgress && (
                <ContentDurationTimer
                  duration={contentDuration}
                  paused={!sessionState?.playing}
                  ref={timerRef}
                />
              )}
            </HostNotes>
            {!sessionSlideState?.next && (
              <>
                <Spacer16 />
                <StyledButton small active onPress={endSession}>
                  {t('endButton')}
                </StyledButton>
              </>
            )}
          </Top>
        )}
        <TopSafeArea minSize={SPACINGS.SIXTEEN} />
        {isHost && <Spacer32 />}
        <AutoScrollView onLayout={onScrollLayout} ref={scrollView}>
          <ContentWrapper>
            {sessionSlideState && (
              <>
                <ExerciseSlides
                  index={sessionSlideState.index}
                  current={sessionSlideState.current}
                  previous={sessionSlideState.previous}
                  next={sessionSlideState.next}
                />
                {!isHost && (
                  <Progress
                    index={sessionSlideState.index}
                    length={exercise?.slides.length}
                  />
                )}
              </>
            )}
            <ExerciseControl
              exercise={exercise}
              isHost={isHost}
              sessionState={sessionState}
              slideState={sessionSlideState}
              currentContentReachedEnd={currentContentReachedEnd}
              onPrevPress={onPrevPress}
              onNextPress={onNextPress}
              onResetPlayingPress={onResetPlayingPress}
              onTogglePlayingPress={onTogglePlayingPress}
            />
          </ContentWrapper>
          <Participants
            containerHeight={scrollHeight}
            participants={participants}
          />
        </AutoScrollView>
        {showTimerProgress && !isHost && (
          <ContentDurationTimerWrapper top={top}>
            <ContentDurationTimer
              duration={contentDuration}
              paused={!sessionState?.playing}
              ref={timerRef}
            />
          </ContentDurationTimerWrapper>
        )}
        <Spacer16 />
        <SessionControls>
          <Notifications />
          <Reactions />
          <IconButton
            onPress={onHeartPress}
            variant="secondary"
            Icon={HeartFillIcon}
            fill={COLORS.WHITE}
          />
          <Spacer12 />
          <IconButton
            onPress={toggleAudioPress}
            active={!hasAudio}
            variant="secondary"
            Icon={hasAudio ? MicrophoneIcon : MicrophoneOffIcon}
          />
          <Spacer12 />
          <IconButton
            onPress={toggleVideoPress}
            active={!hasVideo}
            variant="secondary"
            Icon={hasVideo ? FilmCameraIcon : FilmCameraOffIcon}
          />
          <Spacer12 />
          <IconButton
            variant="secondary"
            Icon={StyledHangUpIcon}
            fill={COLORS.ACTIVE}
            onPress={leaveSessionWithConfirm}
          />
        </SessionControls>
        <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
      </Screen>
    </ProgressTimerContext.Provider>
  );
};

export default React.memo(Session);

import React, {useCallback, useContext, useEffect, useMemo} from 'react';
import styled from 'styled-components/native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import useSessionState from './state/state';
import {
  BottomSafeArea,
  Spacer12,
  Spacer16,
  Spacer32,
  TopSafeArea,
} from '../../lib/components/Spacers/Spacer';
import {COLORS} from '../../../../shared/src/constants/colors';
import {SessionStackProps} from '../../lib/navigation/constants/routes';
import {DailyContext} from '../../lib/daily/DailyProvider';
import ExerciseSlides from './components/ExerciseSlides/ExerciseSlides';
import Participants from './components/Participants/Participants';
import useSessionParticipants from './hooks/useSessionParticipants';
import useSessionSlideState from './hooks/useSessionSlideState';
import ProgressBar from './components/ProgressBar/ProgressBar';
import {SPACINGS} from '../../lib/constants/spacings';
import ContentControls from './components/ContentControls/ContentControls';
import {DailyUserData} from '../../../../shared/src/types/Session';
import IconButton from '../../lib/components/Buttons/IconButton/IconButton';
import {
  FilmCameraIcon,
  FilmCameraOffIcon,
  HangUpIcon,
  MicrophoneIcon,
  MicrophoneOffIcon,
} from '../../lib/components/Icons';
import usePreventGoingBack from '../../lib/navigation/hooks/usePreventGoingBack';
import useLeaveSession from './hooks/useLeaveSession';
import useIsSessionHost from './hooks/useIsSessionHost';
import Button from '../../lib/components/Buttons/Button';
import HostNotes from './components/HostNotes/HostNotes';
import Screen from '../../lib/components/Screen/Screen';
import useLocalParticipant from '../../lib/daily/hooks/useLocalParticipant';
import useUser from '../../lib/user/hooks/useUser';
import useSubscribeToSessionIfFocused from './hooks/useSusbscribeToSessionIfFocused';
import useExerciseTheme from './hooks/useExerciseTheme';
import useSessionExercise from './hooks/useSessionExercise';
import useUpdateSessionState from './hooks/useUpdateSessionState';
import useLogInSessionMetricEvents from './hooks/useLogInSessionMetricEvents';
import useCheckPermissions from './hooks/useCheckPermissions';
import useUserState from '../../lib/user/state/state';

const Spotlight = styled.View({
  aspectRatio: '0.9375',
});

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
  right: SPACINGS.SIXTEEN,
  top: SPACINGS.EIGHT,
});

const SpotlightContent = styled.View({
  flex: 1,
});

const Top = styled.View({
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  zIndex: 1,
});

const StyledButton = styled(Button)({
  alignSelf: 'flex-end',
  marginRight: SPACINGS.SIXTEEN,
});

const StyledHangUpIcon = () => <HangUpIcon fill={COLORS.ACTIVE} />;

const Session = () => {
  const {
    setUserData,
    toggleAudio,
    toggleVideo,
    setSubscribeToAllTracks,
    leaveMeeting,
  } = useContext(DailyContext);
  const {
    params: {session},
  } = useRoute<RouteProp<SessionStackProps, 'Session'>>();
  const {navigate} =
    useNavigation<NativeStackNavigationProp<SessionStackProps>>();
  const {t} = useTranslation('Screen.Session');
  useSubscribeToSessionIfFocused(session, {exitOnEnded: false});

  const participants = useSessionParticipants();
  const {endSession} = useUpdateSessionState(session.id);
  const me = useLocalParticipant();
  const isHost = useIsSessionHost();
  const sessionState = useSessionState(state => state.sessionState);
  const sessionSlideState = useSessionSlideState();
  const exercise = useSessionExercise();
  const theme = useExerciseTheme();
  const logSessionMetricEvent = useLogInSessionMetricEvents();
  const {leaveSessionWithConfirm} = useLeaveSession();
  const {checkCameraPermissions, checkMicrophonePermissions} =
    useCheckPermissions();
  const user = useUser();
  const {setCompletedSessions} = useUserState();
  const userState = useUserState(state => state.userState);

  const completedSessions = useMemo(
    () => userState?.completedSessions ?? [],
    [userState],
  );

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
      setCompletedSessions([...completedSessions, {id: session.id}]);
      logSessionMetricEvent('Complete Sharing Session');
    }
  }, [sessionState?.completed, logSessionMetricEvent]);

  useEffect(() => {
    if (sessionState?.ended) {
      leaveMeeting().then(() => navigate('OutroPortal'));
    }
  }, [sessionState?.ended, navigate, leaveMeeting]);

  useEffect(() => {
    setUserData({
      inPortal: false,
      photoURL: user?.photoURL,
    } as DailyUserData);
    setSubscribeToAllTracks();
  }, [setUserData, setSubscribeToAllTracks, user?.photoURL]);

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

  return (
    <Screen backgroundColor={theme?.backgroundColor}>
      {isHost && (
        <Top>
          <HostNotes />
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
      <TopSafeArea />
      <Spotlight>
        {sessionSlideState && (
          <SpotlightContent>
            {isHost && <Spacer32 />}
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
          </SpotlightContent>
        )}
        <ExerciseControl sessionId={session.id} />
      </Spotlight>
      <Participants participants={participants} />
      <Spacer16 />
      <SessionControls>
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
  );
};

export default Session;

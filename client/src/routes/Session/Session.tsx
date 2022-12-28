import React, {useCallback, useContext, useEffect} from 'react';
import styled from 'styled-components/native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import useSessionState from './state/state';
import {
  BottomSafeArea,
  Spacer12,
  Spacer16,
  Spacer32,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {COLORS} from '../../../../shared/src/constants/colors';
import {SessionStackProps} from '../../lib/navigation/constants/routes';
import {DailyContext} from '../../lib/daily/DailyProvider';
import ExerciseSlides from './components/ExerciseSlides/ExerciseSlides';
import Participants from './components/Participants/Participants';
import useSessionParticipants from './hooks/useSessionParticipants';
import useSessionSlideState from './hooks/useSessionSlideState';
import useMuteAudioListener from './hooks/useMuteAudioListener';
import ProgressBar from './components/ProgressBar/ProgressBar';
import {SPACINGS} from '../../common/constants/spacings';
import ContentControls from './components/ContentControls/ContentControls';
import {DailyUserData} from '../../../../shared/src/types/Session';
import IconButton from '../../common/components/Buttons/IconButton/IconButton';
import {
  FilmCameraIcon,
  FilmCameraOffIcon,
  HangUpIcon,
  MicrophoneIcon,
  MicrophoneOffIcon,
} from '../../common/components/Icons';
import usePreventGoingBack from '../../lib/navigation/hooks/usePreventGoingBack';

import useLeaveSession from './hooks/useLeaveSession';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import useIsSessionHost from './hooks/useIsSessionHost';
import Button from '../../common/components/Buttons/Button';
import useUpdateSession from './hooks/useUpdateSession';
import {useTranslation} from 'react-i18next';
import HostNotes from './components/HostNotes/HostNotes';
import Screen from '../../common/components/Screen/Screen';
import useLocalParticipant from '../../lib/daily/hooks/useLocalParticipant';
import useUser from '../../lib/user/hooks/useUser';
import useSubscribeToSessionIfFocused from './hooks/useSusbscribeToSessionIfFocused';
import useExerciseTheme from './hooks/useExerciseTheme';
import useExerciseById from '../../lib/content/hooks/useExerciseById';
import useLogInSessionMetricEvents from './hooks/useLogInSessionMetricEvents';
import {Alert, Linking} from 'react-native';

const Spotlight = styled.View({
  aspectRatio: '0.9375',
});

const ExerciseControl = styled(ContentControls)({
  position: 'absolute',
  bottom: SPACINGS.SIXTEEN,
  left: SPACINGS.SIXTEEN,
  right: SPACINGS.SIXTEEN,
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

const FloatingHostNotes = styled(HostNotes)({
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
    hasMicrophonePermissions,
    hasCameraPermissions,
    setUserData,
    toggleAudio,
    toggleVideo,
    setSubscribeToAllTracks,
    leaveMeeting,
  } = useContext(DailyContext);
  const {
    params: {sessionId},
  } = useRoute<RouteProp<SessionStackProps, 'Session'>>();
  const {navigate} =
    useNavigation<NativeStackNavigationProp<SessionStackProps>>();
  const {t} = useTranslation('Screen.Session');
  useSubscribeToSessionIfFocused(sessionId, {exitOnEnded: false});
  useMuteAudioListener();

  const participants = useSessionParticipants();
  const {setEnded} = useUpdateSession(sessionId);
  const me = useLocalParticipant();
  const isHost = useIsSessionHost();
  const session = useSessionState(state => state.session);
  const sessionSlideState = useSessionSlideState();
  const exercise = useExerciseById(session?.contentId);
  const theme = useExerciseTheme();
  const {logSessionMetricEvent, conditionallyLogCompleteSessionMetricEvent} =
    useLogInSessionMetricEvents();
  const {leaveSessionWithConfirm} = useLeaveSession();
  const user = useUser();

  const hasAudio = Boolean(me?.audioTrack);
  const hasVideo = Boolean(me?.videoTrack);

  usePreventGoingBack(leaveSessionWithConfirm);

  useEffect(() => {
    if (session?.id) {
      logSessionMetricEvent('Enter Sharing Session');
    }
  }, [logSessionMetricEvent, session?.id]);

  useEffect(() => {
    if (session?.id && sessionSlideState?.current) {
      conditionallyLogCompleteSessionMetricEvent();
    }
  }, [
    conditionallyLogCompleteSessionMetricEvent,
    session?.id,
    sessionSlideState,
  ]);

  useEffect(() => {
    if (session?.ended) {
      leaveMeeting();
      navigate('OutroPortal');
    }
  }, [session?.ended, navigate, leaveMeeting]);

  useEffect(() => {
    setUserData({
      inPortal: false,
      photoURL: user?.photoURL,
    } as DailyUserData);
    setSubscribeToAllTracks();
  }, [setUserData, setSubscribeToAllTracks, user?.photoURL]);

  const toggleAudioPress = useCallback(() => {
    if (hasMicrophonePermissions()) {
      toggleAudio(!hasAudio);
    } else {
      Alert.alert(
        t('permissionsAlert.microphone.title'),
        t('permissionsAlert.microphone.message'),
        [
          {
            text: t('permissionsAlert.microphone.dismiss'),
          },
          {
            style: 'cancel',
            text: t('permissionsAlert.microphone.confirm'),
            onPress: () => Linking.openSettings(),
          },
        ],
      );
    }
  }, [t, hasMicrophonePermissions, toggleAudio, hasAudio]);

  const toggleVideoPress = useCallback(() => {
    if (hasCameraPermissions()) {
      toggleVideo(!hasVideo);
    } else {
      Alert.alert(
        t('permissionsAlert.camera.title'),
        t('permissionsAlert.camera.message'),
        [
          {
            text: t('permissionsAlert.camera.dismiss'),
          },
          {
            style: 'cancel',
            text: t('permissionsAlert.camera.confirm'),
            onPress: () => Linking.openSettings(),
          },
        ],
      );
    }
  }, [t, hasCameraPermissions, toggleVideo, hasVideo]);

  return (
    <Screen backgroundColor={theme?.backgroundColor}>
      {isHost && (
        <FloatingHostNotes>
          {!sessionSlideState?.next && (
            <>
              <Spacer16 />
              <StyledButton small active onPress={setEnded}>
                {t('endButton')}
              </StyledButton>
            </>
          )}
        </FloatingHostNotes>
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
        <ExerciseControl sessionId={sessionId} />
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

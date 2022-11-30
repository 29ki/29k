import React, {useContext, useEffect} from 'react';
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
import useSessionExercise from './hooks/useSessionExercise';
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

const Session = () => {
  const {
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
  const exercise = useSessionExercise();
  const {leaveSessionWithConfirm} = useLeaveSession();
  const user = useUser();
  usePreventGoingBack(leaveSessionWithConfirm);
  const backgroundColor = exercise?.theme?.backgroundColor;

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

  const hasAudio = Boolean(me?.audioTrack);
  const hasVideo = Boolean(me?.videoTrack);

  return (
    <Screen backgroundColor={exercise?.theme?.backgroundColor}>
      {isHost && (
        <FloatingHostNotes>
          {!exercise?.slide.next && (
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
        {exercise && (
          <SpotlightContent>
            {isHost && <Spacer32 />}
            <ExerciseSlides
              index={exercise.slide.index}
              current={exercise.slide.current}
              previous={exercise.slide.previous}
              next={exercise.slide.next}
              backgroundColor={backgroundColor}
            />
            {!isHost && (
              <Progress
                index={exercise?.slide.index}
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
          onPress={() => toggleAudio(!hasAudio)}
          active={!hasAudio}
          variant="secondary"
          Icon={hasAudio ? MicrophoneIcon : MicrophoneOffIcon}
        />
        <Spacer12 />
        <IconButton
          onPress={() => toggleVideo(!hasVideo)}
          active={!hasVideo}
          variant="secondary"
          Icon={hasVideo ? FilmCameraIcon : FilmCameraOffIcon}
        />
        <Spacer12 />
        <IconButton
          variant="secondary"
          Icon={HangUpIcon}
          fill={COLORS.ACTIVE}
          onPress={leaveSessionWithConfirm}
        />
      </SessionControls>
      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </Screen>
  );
};

export default Session;

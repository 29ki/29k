import React, {useContext, useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import {useRecoilValue} from 'recoil';

import styled from 'styled-components/native';

import {videoSharingFields, localParticipantSelector} from './state/state';
import {RouteProp, useRoute} from '@react-navigation/native';

import {
  Spacer12,
  Spacer16,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {COLORS} from '../../common/constants/colors';

import {TempleStackProps} from '../../common/constants/routes';

import {DailyContext} from './DailyProvider';

import ExerciseSlides from './components/ExerciseSlides/ExerciseSlides';

import Participants from './components/Participants/Participants';
import useSubscribeToTemple from './hooks/useSubscribeToTemple';
import useTempleParticipants from './hooks/useTempleParticipants';
import useTempleExercise from './hooks/useTempleExercise';
import useMuteAudioListener from './hooks/useMuteAudioListener';
import ProgressBar from './components/ProgressBar/ProgressBar';
import {SPACINGS} from '../../common/constants/spacings';
import ContentControls from './components/ContentControls/ContentControls';
import {DailyUserData} from '../../../../shared/src/types/Temple';
import IconButton from '../../common/components/Buttons/IconButton/IconButton';
import {
  FilmCameraIcon,
  FilmCameraOffIcon,
  HangUpIcon,
  MicrophoneIcon,
  MicrophoneOffIcon,
} from '../../common/components/Icons';

import usePreventTempleLeave from './hooks/usePreventTempleLeave';
import useLeaveTemple from './hooks/useLeaveTemple';

const LoadingView = styled.View({
  flex: 1,
  justifyContent: 'center',
});

const Spotlight = styled.View({
  aspectRatio: '0.85',
});

const MainViewContainer = styled.View({
  flex: 1,
});

const ExerciseControl = styled(ContentControls)({
  position: 'absolute',
  bottom: 20,
  left: 20,
  right: 20,
});

const SessionControls = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
});

const Progress = styled(ProgressBar)({
  marginHorizontal: SPACINGS.SIXTEEN,
});

const Session = () => {
  const {setUserData, toggleAudio, toggleVideo, setSubscribeToAllTracks} =
    useContext(DailyContext);
  const {
    params: {templeId},
  } = useRoute<RouteProp<TempleStackProps, 'Temple'>>();

  useSubscribeToTemple(templeId);
  useMuteAudioListener();

  const participants = useTempleParticipants();
  const me = useRecoilValue(localParticipantSelector);
  const isLoading = useRecoilValue(videoSharingFields('isLoading'));
  const exercise = useTempleExercise();
  const leaveTemple = useLeaveTemple();

  usePreventTempleLeave();

  useEffect(() => {
    setUserData({inPortal: false} as DailyUserData);
    setSubscribeToAllTracks();
  }, [setUserData, setSubscribeToAllTracks]);

  if (isLoading) {
    return (
      <LoadingView>
        <ActivityIndicator size="large" color={COLORS.BLACK} />
      </LoadingView>
    );
  }

  const hasAudio = Boolean(me?.audioTrack);
  const hasVideo = Boolean(me?.videoTrack);

  return (
    <MainViewContainer>
      <Spotlight>
        <TopSafeArea />
        {exercise && (
          <>
            <Progress
              index={exercise?.slide.index}
              length={exercise?.slides.length}
            />
            <ExerciseSlides
              index={exercise.slide.index}
              current={exercise.slide.current}
              previous={exercise.slide.previous}
              next={exercise.slide.next}
            />
          </>
        )}
        <ExerciseControl templeId={templeId} />
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
          onPress={leaveTemple}
        />
      </SessionControls>
      <Spacer16 />
    </MainViewContainer>
  );
};

export default Session;

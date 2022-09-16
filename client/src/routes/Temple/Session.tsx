import React, {useContext, useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import {useRecoilValue} from 'recoil';

import styled from 'styled-components/native';

import {
  videoSharingFields,
  localParticipantSelector,
  templeExerciseStateSelector,
} from './state/state';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {
  Spacer12,
  Spacer16,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import AudioToggleButton from './components/Buttons/AudioToggleButton';
import VideoToggleButton from './components/Buttons/VideoToggleButton';
import {COLORS} from '../../common/constants/colors';
import LeaveButton from './components/Buttons/LeaveButton';
import {
  TabNavigatorProps,
  TempleStackProps,
} from '../../common/constants/routes';

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

type ScreenNavigationProps = NativeStackNavigationProp<TabNavigatorProps>;

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
  const {joinMeeting, leaveMeeting, toggleAudio, toggleVideo} =
    useContext(DailyContext);
  const {
    params: {templeId},
  } = useRoute<RouteProp<TempleStackProps, 'Temple'>>();
  const {navigate} = useNavigation<ScreenNavigationProps>();

  useSubscribeToTemple(templeId);
  useMuteAudioListener();

  const exerciseState = useRecoilValue(templeExerciseStateSelector);
  const participants = useTempleParticipants();
  const me = useRecoilValue(localParticipantSelector);
  const isLoading = useRecoilValue(videoSharingFields('isLoading'));
  const exercise = useTempleExercise();

  useEffect(() => {
    joinMeeting();
  }, [joinMeeting]);

  const exitMeeting = async () => {
    await leaveMeeting();
    navigate('Temples');
  };

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
        {exerciseState?.active && exercise && (
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
        <AudioToggleButton
          onPress={() => toggleAudio(!hasAudio)}
          active={hasAudio}
        />
        <Spacer12 />
        <VideoToggleButton
          onPress={() => toggleVideo(!hasVideo)}
          active={hasVideo}
        />
        <Spacer12 />
        <LeaveButton fill={COLORS.ROSE500} onPress={exitMeeting} />
      </SessionControls>
      <Spacer16 />
    </MainViewContainer>
  );
};

export default Session;

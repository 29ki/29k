import React, {useContext, useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import {useRecoilValue} from 'recoil';

import styled from 'styled-components/native';

import {videoSharingFields, localParticipantSelector} from './state/state';
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
import {DailyUserData} from '../../../../shared/src/types/Temple';
import useConfirmExitTemple from './hooks/useConfirmExitTemple';

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
  const {setUserData, toggleAudio, toggleVideo, setSubscribeToAllTracks} =
    useContext(DailyContext);
  const {
    params: {templeId},
  } = useRoute<RouteProp<TempleStackProps, 'Temple'>>();
  const {goBack} = useNavigation<ScreenNavigationProps>();

  useSubscribeToTemple(templeId);
  useMuteAudioListener();

  const participants = useTempleParticipants();
  const me = useRecoilValue(localParticipantSelector);
  const isLoading = useRecoilValue(videoSharingFields('isLoading'));
  const exercise = useTempleExercise();

  useConfirmExitTemple();

  useEffect(() => {
    setUserData({inPortal: false} as DailyUserData);
    setSubscribeToAllTracks();
  }, [setUserData, setSubscribeToAllTracks]);

  const exitMeeting = async () => {
    // This is actually not a back - it's triggering the useConfirmExitTemple event listener
    goBack();
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
        <LeaveButton fill={COLORS.ACTIVE} onPress={exitMeeting} />
      </SessionControls>
      <Spacer16 />
    </MainViewContainer>
  );
};

export default Session;

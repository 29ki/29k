import React, {useContext, useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import {useRecoilValue} from 'recoil';

import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';

import {
  videoSharingFields,
  templeAtom,
  localParticipantSelector,
} from './state/state';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {
  Spacer8,
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
import NS from '../../lib/i18n/constants/namespaces';

import ExerciseSlides from './components/ExerciseSlides/ExerciseSlides';
import SlideButton from './components/Buttons/SlideButton';
import {
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Rewind,
} from '../../common/components/Icons';
import {userAtom} from '../../lib/user/state/state';
import Participants from './components/Participants/Participants';
import useUpdateTempleExerciseState from './hooks/useUpdateTempleExerciseState';
import useSubscribeToTemple from './hooks/useSubscribeToTemple';
import useTempleParticipants from './hooks/useTempleParticipants';
import useTempleExercise from './hooks/useTempleExercise';
import ProgressBar from './components/ProgressBar/ProgressBar';

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

const SessionControls = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
});

const ContentControls = styled.View({
  position: 'absolute',
  bottom: 20,
  left: 20,
  right: 20,
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const MediaControls = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
});

const Session = () => {
  const {joinMeeting, leaveMeeting, toggleAudio, toggleVideo} =
    useContext(DailyContext);
  const {
    params: {templeId},
  } = useRoute<RouteProp<TempleStackProps, 'Temple'>>();
  const {navigate} = useNavigation<ScreenNavigationProps>();
  const {t} = useTranslation(NS.SCREEN.TEMPLE);

  useSubscribeToTemple(templeId);
  const {navigateToIndex, setActive, setPlaying} =
    useUpdateTempleExerciseState(templeId);

  const user = useRecoilValue(userAtom);
  const temple = useRecoilValue(templeAtom);
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
        <ProgressBar
          index={exercise?.slide.index}
          length={exercise?.slides.length}
        />
        {!temple?.exerciseState.active && temple?.facilitator === user?.uid && (
          <ContentControls>
            <SlideButton
              onPress={() => setActive(true)}
              RightIcon={ChevronRight}>
              {t('controls.start')}
            </SlideButton>
          </ContentControls>
        )}
        {temple?.exerciseState.active && exercise && (
          <>
            <ExerciseSlides
              index={exercise.slide.index}
              current={exercise.slide.current}
              previous={exercise.slide.previous}
              next={exercise.slide.next}
              playing={temple.exerciseState.playing}
            />
            {temple?.facilitator === user?.uid && (
              <ContentControls>
                {temple.exerciseState.index > 0 && (
                  <SlideButton
                    LeftIcon={ChevronLeft}
                    onPress={() =>
                      navigateToIndex({
                        index: temple.exerciseState.index - 1,
                        content: exercise.slides,
                      })
                    }
                  />
                )}
                {exercise.slide.current.type !== 'participantSpotlight' && (
                  <MediaControls>
                    <SlideButton
                      LeftIcon={Rewind}
                      onPress={() => setPlaying(!temple.exerciseState.playing)}
                    />
                    <Spacer8 />
                    <SlideButton
                      LeftIcon={temple.exerciseState.playing ? Pause : Play}
                      onPress={() => setPlaying(!temple.exerciseState.playing)}
                    />
                  </MediaControls>
                )}
                {temple.exerciseState.index < exercise.slides.length - 1 && (
                  <SlideButton
                    RightIcon={ChevronRight}
                    onPress={() =>
                      navigateToIndex({
                        index: temple.exerciseState.index + 1,
                        content: exercise.slides,
                      })
                    }
                  />
                )}
              </ContentControls>
            )}
          </>
        )}
      </Spotlight>
      {participants && <Participants participants={participants} />}
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

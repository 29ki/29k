import React, {useContext, useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {
  videoSharingFields,
  localParticipantSelector,
  templeAtom,
} from './state/state';
import {
  BottomSafeArea,
  Spacer12,
  Spacer16,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {COLORS} from '../../../../shared/src/constants/colors';

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
import usePreventGoingBack from '../../lib/navigation/hooks/usePreventGoingBack';

import useLeaveTemple from './hooks/useLeaveTemple';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const LoadingView = styled.View({
  flex: 1,
  justifyContent: 'center',
});

const Spotlight = styled.View({
  aspectRatio: '0.9375',
});

type WrapperProps = {backgroundColor?: string};
const Wrapper = styled.View<WrapperProps>(({backgroundColor}) => ({
  flex: 1,
  backgroundColor: backgroundColor ?? COLORS.WHITE,
}));

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

const Temple = () => {
  const {setUserData, toggleAudio, toggleVideo, setSubscribeToAllTracks} =
    useContext(DailyContext);
  const {
    params: {templeId},
  } = useRoute<RouteProp<TempleStackProps, 'Temple'>>();
  const {navigate} =
    useNavigation<NativeStackNavigationProp<TempleStackProps>>();

  useSubscribeToTemple(templeId);
  useMuteAudioListener();

  const participants = useTempleParticipants();
  const me = useRecoilValue(localParticipantSelector);
  const isLoading = useRecoilValue(videoSharingFields('isLoading'));
  const temple = useRecoilValue(templeAtom);
  const exercise = useTempleExercise();
  const leaveTemple = useLeaveTemple();

  usePreventGoingBack(leaveTemple);

  useEffect(() => {
    if (temple?.exerciseState.ended) {
      navigate('OutroPortal');
    }
  }, [temple?.exerciseState, navigate]);

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
    <Wrapper backgroundColor={exercise?.theme?.backgroundColor}>
      <TopSafeArea />
      <Spotlight>
        {exercise && (
          <SpotlightContent>
            <ExerciseSlides
              index={exercise.slide.index}
              current={exercise.slide.current}
              previous={exercise.slide.previous}
              next={exercise.slide.next}
            />
            <Progress
              index={exercise?.slide.index}
              length={exercise?.slides.length}
            />
          </SpotlightContent>
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
      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </Wrapper>
  );
};

export default Temple;

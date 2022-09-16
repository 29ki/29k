import React from 'react';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import {ViewStyle} from 'react-native';

import useIsTempleFacilitator from '../../hooks/useIsTempleFacilitator';
import {templeExerciseStateSelector} from '../../state/state';
import useTempleExercise from '../../hooks/useTempleExercise';

import SlideButton from '../Buttons/SlideButton';
import {
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Rewind,
} from '../../../../common/components/Icons';

import useUpdateTempleExerciseState from '../../hooks/useUpdateTempleExerciseState';
import {Spacer8} from '../../../../common/components/Spacers/Spacer';

const Wrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const MediaControls = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
});

type ContentControlsProps = {
  templeId: string;
  style?: ViewStyle;
};

const ContentControls: React.FC<ContentControlsProps> = ({templeId, style}) => {
  const isFacilitator = useIsTempleFacilitator();
  const exerciseState = useRecoilValue(templeExerciseStateSelector);
  const exercise = useTempleExercise();

  const {navigateToIndex, setPlaying} = useUpdateTempleExerciseState(templeId);

  if (!isFacilitator || !exercise || !exerciseState) {
    return null;
  }

  return (
    <Wrapper style={style}>
      <SlideButton
        Icon={ChevronLeft}
        onPress={() =>
          navigateToIndex({
            index: exercise.slide.index - 1,
            content: exercise.slides,
          })
        }
        disabled={!exercise.slide.previous}
      />
      {exercise.slide.current.type !== 'participantSpotlight' && (
        <MediaControls>
          <SlideButton
            Icon={Rewind}
            onPress={() => setPlaying(exerciseState.playing)}
          />
          <Spacer8 />
          <SlideButton
            Icon={exerciseState.playing ? Pause : Play}
            onPress={() => setPlaying(!exerciseState.playing)}
          />
        </MediaControls>
      )}
      <SlideButton
        Icon={ChevronRight}
        onPress={() =>
          navigateToIndex({
            index: exerciseState.index + 1,
            content: exercise.slides,
          })
        }
        disabled={!exercise.slide.next}
      />
    </Wrapper>
  );
};

export default ContentControls;

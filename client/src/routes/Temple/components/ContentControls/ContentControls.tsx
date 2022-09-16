import React from 'react';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';

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
import {useTranslation} from 'react-i18next';
import useUpdateTempleExerciseState from '../../hooks/useUpdateTempleExerciseState';
import NS from '../../../../lib/i18n/constants/namespaces';
import {Spacer8} from '../../../../common/components/Spacers/Spacer';
import Button from '../../../../common/components/Buttons/Button';
import {ViewStyle} from 'react-native';

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
  const {t} = useTranslation(NS.SCREEN.TEMPLE);

  const {navigateToIndex, setActive, setPlaying} =
    useUpdateTempleExerciseState(templeId);

  if (!isFacilitator || !exercise) {
    return null;
  }

  if (!exerciseState?.active) {
    return (
      <Wrapper style={style}>
        <Button onPress={() => setActive(true)} RightIcon={ChevronRight}>
          {t('controls.start')}
        </Button>
      </Wrapper>
    );
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

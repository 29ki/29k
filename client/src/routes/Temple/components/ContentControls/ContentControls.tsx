import React from 'react';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import {ViewStyle} from 'react-native';
import {useTranslation} from 'react-i18next';

import useIsTempleFacilitator from '../../hooks/useIsTempleFacilitator';
import {templeExerciseStateSelector} from '../../state/state';
import useTempleExercise from '../../hooks/useTempleExercise';

import {
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Rewind,
} from '../../../../common/components/Icons';

import useUpdateTempleExerciseState from '../../hooks/useUpdateTempleExerciseState';
import {Spacer8} from '../../../../common/components/Spacers/Spacer';
import Button from '../../../../common/components/Buttons/Button';
import NS from '../../../../lib/i18n/constants/namespaces';
import IconButton from '../../../../common/components/Buttons/IconButton/IconButton';
import useUpdateTemple from '../../hooks/useUpdateTemple';

const Wrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const MediaControls = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
});

const SlideButton = styled(Button)(({disabled}) => ({
  opacity: disabled ? 0 : 1,
}));

type ContentControlsProps = {
  templeId: string;
  style?: ViewStyle;
};

const ContentControls: React.FC<ContentControlsProps> = ({templeId, style}) => {
  const isFacilitator = useIsTempleFacilitator();
  const exerciseState = useRecoilValue(templeExerciseStateSelector);
  const exercise = useTempleExercise();
  const {t} = useTranslation(NS.SCREEN.TEMPLE);

  const {navigateToIndex, setPlaying} = useUpdateTempleExerciseState(templeId);
  const {setEnded} = useUpdateTemple(templeId);

  if (!isFacilitator || !exercise || !exerciseState) {
    return null;
  }

  return (
    <Wrapper style={style}>
      <SlideButton
        variant="tertiary"
        small
        LeftIcon={ChevronLeft}
        disabled={!exercise.slide.previous}
        elevated
        onPress={() =>
          navigateToIndex({
            index: exercise.slide.index - 1,
            content: exercise.slides,
          })
        }>
        {t('controls.prev')}
      </SlideButton>
      {exercise.slide.current.type !== 'participantSpotlight' && (
        <MediaControls>
          <IconButton
            small
            elevated
            variant="tertiary"
            Icon={Rewind}
            onPress={() => setPlaying(exerciseState.playing)}
          />
          <Spacer8 />
          <IconButton
            small
            elevated
            variant="tertiary"
            Icon={exerciseState.playing ? Pause : Play}
            onPress={() => setPlaying(!exerciseState.playing)}
          />
        </MediaControls>
      )}
      {exercise.slide.next ? (
        <SlideButton
          small
          elevated
          variant="tertiary"
          RightIcon={ChevronRight}
          onPress={() =>
            navigateToIndex({
              index: exerciseState.index + 1,
              content: exercise.slides,
            })
          }>
          {t('controls.next')}
        </SlideButton>
      ) : (
        <SlideButton small elevated variant="tertiary" onPress={setEnded}>
          {t('controls.end')}
        </SlideButton>
      )}
    </Wrapper>
  );
};

export default ContentControls;

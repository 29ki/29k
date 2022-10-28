import React from 'react';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import {ViewStyle} from 'react-native';
import {useTranslation} from 'react-i18next';

import useIsSessionHost from '../../hooks/useIsSessionHost';
import {sessionExerciseStateSelector} from '../../state/state';
import useSessionExercise from '../../hooks/useSessionExercise';

import {
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Rewind,
} from '../../../../common/components/Icons';

import useUpdateSessionExerciseState from '../../hooks/useUpdateSessionExerciseState';
import {Spacer8} from '../../../../common/components/Spacers/Spacer';
import Button from '../../../../common/components/Buttons/Button';
import IconButton from '../../../../common/components/Buttons/IconButton/IconButton';

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

const IconSlideButton = styled(IconButton)(({disabled}) => ({
  opacity: disabled ? 0 : 1,
}));

type ContentControlsProps = {
  sessionId: string;
  style?: ViewStyle;
};

const ContentControls: React.FC<ContentControlsProps> = ({
  sessionId,
  style,
}) => {
  const isFacilitator = useIsSessionHost();
  const exerciseState = useRecoilValue(sessionExerciseStateSelector);
  const exercise = useSessionExercise();
  const {t} = useTranslation('Screen.Session');

  const {navigateToIndex, setPlaying} =
    useUpdateSessionExerciseState(sessionId);

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
      {exercise.slide.current.type !== 'host' && (
        <MediaControls>
          <IconSlideButton
            small
            elevated
            disabled={!exercise.slide.current.content.video}
            variant="tertiary"
            Icon={Rewind}
            onPress={() => setPlaying(exerciseState.playing)}
          />
          <Spacer8 />
          <IconSlideButton
            small
            elevated
            disabled={!exercise.slide.current.content.video}
            variant="tertiary"
            Icon={exerciseState.playing ? Pause : Play}
            onPress={() => setPlaying(!exerciseState.playing)}
          />
        </MediaControls>
      )}
      <SlideButton
        small
        elevated
        variant="tertiary"
        disabled={!exercise.slide.next}
        RightIcon={ChevronRight}
        onPress={() =>
          navigateToIndex({
            index: exerciseState.index + 1,
            content: exercise.slides,
          })
        }>
        {t('controls.next')}
      </SlideButton>
    </Wrapper>
  );
};

export default ContentControls;

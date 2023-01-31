import React from 'react';
import styled from 'styled-components/native';
import {ViewStyle} from 'react-native';
import {useTranslation} from 'react-i18next';

import {SessionSlideState} from '../../../session/hooks/useSessionSlideState';

import {
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Rewind,
} from '../../../components/Icons';

import {Spacer8} from '../../../components/Spacers/Spacer';
import Button from '../../../components/Buttons/Button';
import IconButton from '../../../components/Buttons/IconButton/IconButton';
import {Exercise} from '../../../../../../shared/src/types/generated/Exercise';
import {SessionState} from '../../../../../../shared/src/types/Session';

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
  style?: ViewStyle;
  exercise: Exercise | null;
  isHost: boolean;
  sessionState: SessionState | null;
  currentContentReachedEnd: boolean;
  slideState: SessionSlideState | null;
  onPrevPress: () => void;
  onNextPress: () => void;
  onResetPlayingPress: () => void;
  onTogglePlayingPress: () => void;
};

const ContentControls: React.FC<ContentControlsProps> = ({
  style,
  isHost,
  sessionState,
  currentContentReachedEnd,
  slideState,
  onPrevPress,
  onNextPress,
  onResetPlayingPress,
  onTogglePlayingPress,
}) => {
  const {t} = useTranslation('Screen.Session');
  if (!isHost || !sessionState || !slideState) {
    return null;
  }

  return (
    <Wrapper style={style}>
      <SlideButton
        variant="tertiary"
        small
        LeftIcon={ChevronLeft}
        disabled={!slideState.previous}
        elevated
        onPress={onPrevPress}>
        {t('controls.prev')}
      </SlideButton>
      {slideState.current.type !== 'host' &&
        !slideState.current.content?.video?.autoPlayLoop &&
        !slideState.current.content?.lottie?.autoPlayLoop && (
          <MediaControls>
            <IconSlideButton
              small
              elevated
              disabled={
                !slideState.current.content?.video &&
                !slideState.current.content?.lottie
              }
              variant="tertiary"
              Icon={Rewind}
              onPress={onResetPlayingPress}
            />
            <Spacer8 />
            <IconSlideButton
              small
              elevated
              disabled={
                !slideState.current.content?.video &&
                !slideState.current.content?.lottie
              }
              variant="tertiary"
              Icon={
                sessionState.playing && !currentContentReachedEnd ? Pause : Play
              }
              onPress={onTogglePlayingPress}
            />
          </MediaControls>
        )}
      <SlideButton
        small
        elevated
        variant="tertiary"
        disabled={!slideState.next}
        RightIcon={ChevronRight}
        onPress={onNextPress}>
        {t('controls.next')}
      </SlideButton>
    </Wrapper>
  );
};

export default ContentControls;

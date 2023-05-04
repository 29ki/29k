import React, {useMemo} from 'react';
import styled from 'styled-components/native';
import {ViewStyle} from 'react-native';
import {useTranslation} from 'react-i18next';

import {SessionSlideState} from '../../../session/hooks/useSessionSlideState';

import {
  ChevronRight,
  ChevronLeftIcon,
  Play,
  Pause,
  RewindIcon,
} from '../../../components/Icons';

import {Spacer8} from '../../../components/Spacers/Spacer';
import Button from '../../../components/Buttons/Button';
import IconButton from '../../../components/Buttons/IconButton/IconButton';
import {Exercise} from '../../../../../../shared/src/types/generated/Exercise';
import {SessionStateType} from '../../../../../../shared/src/schemas/Session';

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
  async?: boolean;
  exercise: Exercise | null;
  isHost: boolean;
  sessionState: SessionStateType | null;
  currentContentReachedEnd: boolean;
  slideState: SessionSlideState | null;
  onPrevPress: () => void;
  onNextPress: () => void;
  onResetPlayingPress: () => void;
  onTogglePlayingPress: () => void;
};

const ContentControls: React.FC<ContentControlsProps> = ({
  style,
  async,
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

  const slideType = slideState?.current.type;
  const hasAutoPlayLoop =
    slideType !== 'host' &&
    slideType !== 'text' &&
    (slideState?.current.content?.video?.autoPlayLoop ||
      slideState?.current.content?.lottie?.autoPlayLoop);
  const isDisabled =
    slideType !== 'host' &&
    slideType !== 'text' &&
    !slideState?.current.content?.video &&
    !slideState?.current.content?.lottie;

  const shouldRenderMediaControls = useMemo(() => {
    if (slideType === 'host' && async) {
      return true;
    }

    if (slideType === 'sharing' && async) {
      return false;
    }

    if (slideType === 'text') {
      return false;
    }

    if (slideType !== 'host' && !hasAutoPlayLoop) {
      return true;
    }

    return false;
  }, [async, slideType, hasAutoPlayLoop]);

  if (!isHost || !sessionState || !slideState) {
    return null;
  }

  return (
    <Wrapper style={style}>
      <SlideButton
        variant="tertiary"
        small
        LeftIcon={ChevronLeftIcon}
        disabled={!slideState.previous}
        elevated
        onPress={onPrevPress}>
        {t('controls.prev')}
      </SlideButton>
      {shouldRenderMediaControls && (
        <MediaControls>
          <IconSlideButton
            small
            elevated
            disabled={isDisabled}
            variant="tertiary"
            Icon={RewindIcon}
            onPress={onResetPlayingPress}
          />
          <Spacer8 />
          <IconSlideButton
            small
            elevated
            disabled={isDisabled}
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

export default React.memo(ContentControls);

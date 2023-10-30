import React, {useMemo} from 'react';
import styled from 'styled-components/native';
import {ViewStyle} from 'react-native';
import {useTranslation} from 'react-i18next';

import {SessionSlideState} from '../../hooks/useLiveSessionSlideState';

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
import SETTINGS from '../../../constants/settings';

const Wrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const MediaControls = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
});

const SlideButton = styled(Button)<{hidden?: boolean}>(({hidden}) => ({
  opacity: hidden ? 0 : 1,
  ...SETTINGS.BOXSHADOW_SMALL,
}));

const IconSlideButton = styled(IconButton)<{hidden?: boolean}>(({hidden}) => ({
  opacity: hidden ? 0 : 1,
  ...SETTINGS.BOXSHADOW_SMALL,
}));

type ContentControlsProps = {
  style?: ViewStyle;
  async?: boolean;
  exercise: Exercise | null;
  isHost: boolean;
  sessionState: SessionStateType | null;
  currentContentReachedEnd: boolean;
  slideState: SessionSlideState | null;
  isConnected: boolean;
  onPrevPress: () => void;
  onNextPress: () => void;
  onResetPlayingPress?: () => void;
  onTogglePlayingPress?: () => void;
};

const ContentControls: React.FC<ContentControlsProps> = ({
  style,
  async,
  isHost,
  sessionState,
  currentContentReachedEnd,
  slideState,
  isConnected,
  onPrevPress,
  onNextPress,
  onResetPlayingPress,
  onTogglePlayingPress,
}) => {
  const {t} = useTranslation('Screen.Session');

  const slideType = slideState?.current.type;
  const hasAutoPlayLoop =
    slideType !== 'host' &&
    slideType !== 'instruction' &&
    (slideState?.current.content?.video?.autoPlayLoop ||
      slideState?.current.content?.lottie?.autoPlayLoop);
  const isHidden =
    slideType !== 'host' &&
    slideType !== 'instruction' &&
    !slideState?.current.content?.video &&
    !slideState?.current.content?.lottie;

  const shouldRenderMediaControls = useMemo(() => {
    if (slideType === 'host' && async) {
      return true;
    }

    if (slideType === 'sharing' && async) {
      return false;
    }

    if (slideType === 'instruction') {
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
        size="small"
        LeftIcon={ChevronLeftIcon}
        hidden={!slideState.previous && !async}
        disabled={!isConnected}
        onPress={onPrevPress}>
        {t('controls.prev')}
      </SlideButton>
      {shouldRenderMediaControls &&
        onResetPlayingPress &&
        onTogglePlayingPress && (
          <MediaControls>
            <IconSlideButton
              size="small"
              hidden={isHidden}
              disabled={!isConnected}
              variant="tertiary"
              Icon={RewindIcon}
              onPress={onResetPlayingPress}
            />
            <Spacer8 />
            <IconSlideButton
              size="small"
              hidden={isHidden}
              disabled={!isConnected}
              variant="tertiary"
              Icon={
                sessionState.playing && !currentContentReachedEnd ? Pause : Play
              }
              onPress={onTogglePlayingPress}
            />
          </MediaControls>
        )}
      {async ? (
        <SlideButton
          size="small"
          variant="tertiary"
          active={!slideState.next}
          disabled={!isConnected}
          RightIcon={slideState.next && ChevronRight}
          onPress={onNextPress}>
          {slideState.next ? t('controls.next') : t('controls.end')}
        </SlideButton>
      ) : (
        <SlideButton
          size="small"
          variant="tertiary"
          hidden={!slideState.next}
          disabled={!isConnected}
          RightIcon={ChevronRight}
          onPress={onNextPress}>
          {t('controls.next')}
        </SlideButton>
      )}
    </Wrapper>
  );
};

export default React.memo(ContentControls);

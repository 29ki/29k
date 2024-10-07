import React, {useMemo} from 'react';
import styled from 'styled-components/native';
import {ViewStyle} from 'react-native';
import {useTranslation} from 'react-i18next';

import {SessionSlideState} from '../../hooks/useLiveSessionSlideState';

import {ChevronRight, ChevronLeftIcon} from '../../../components/Icons';

import Button from '../../../components/Buttons/Button';
import {SessionStateType} from '../../../../../../shared/src/schemas/Session';
import SETTINGS from '../../../constants/settings';
import {ExerciseWithLanguage} from '../../../content/types';
import TimerControls from '../../../components/TimerControls/TimerControls';

const Wrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const SlideButton = styled(Button)<{hidden?: boolean}>(({hidden}) => ({
  opacity: hidden ? 0 : 1,
  ...SETTINGS.BOXSHADOW_SMALL,
}));

type ContentControlsProps = {
  style?: ViewStyle;
  async?: boolean;
  exercise: ExerciseWithLanguage | null;
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

  const shouldRenderTimerControls = useMemo(() => {
    if (isHidden) {
      return true;
    }

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
  }, [async, slideType, hasAutoPlayLoop, isHidden]);

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
      {shouldRenderTimerControls &&
        onResetPlayingPress &&
        onTogglePlayingPress && (
          <TimerControls
            playing={sessionState.playing && !currentContentReachedEnd}
            disabled={!isConnected}
            onReset={onResetPlayingPress}
            onTogglePlay={onTogglePlayingPress}
          />
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

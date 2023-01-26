import React, {useCallback} from 'react';
import styled from 'styled-components/native';
import {ViewStyle} from 'react-native';
import {useTranslation} from 'react-i18next';

import useIsSessionHost from '../../hooks/useIsSessionHost';
import useSessionState from '../../state/state';
import useSessionSlideState from '../../hooks/useSessionSlideState';

import {
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Rewind,
} from '../../../../lib/components/Icons';

import useUpdateSessionState from '../../hooks/useUpdateSessionState';
import {Spacer8} from '../../../../lib/components/Spacers/Spacer';
import Button from '../../../../lib/components/Buttons/Button';
import IconButton from '../../../../lib/components/Buttons/IconButton/IconButton';

import useSessionExercise from '../../hooks/useSessionExercise';
import useMuteAudio from '../../hooks/useMuteAudio';

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
  const isHost = useIsSessionHost();
  const sessionState = useSessionState(state => state.sessionState);
  const currentContentReachedEnd = useSessionState(
    state => state.currentContentReachedEnd,
  );
  const setCurrentContentReachedEnd = useSessionState(
    state => state.setCurrentContentReachedEnd,
  );
  const exercise = useSessionExercise();
  const slideState = useSessionSlideState();
  const {t} = useTranslation('Screen.Session');
  const {conditionallyMuteParticipants} = useMuteAudio();
  const {navigateToIndex, setPlaying} = useUpdateSessionState(sessionId);

  const onPrevPress = useCallback(() => {
    if (slideState && exercise?.slides) {
      navigateToIndex({
        index: slideState.index - 1,
        content: exercise?.slides,
      });
    }
  }, [slideState, exercise?.slides, navigateToIndex]);

  const onNextPress = useCallback(() => {
    if (slideState && exercise?.slides) {
      navigateToIndex({
        index: slideState.index + 1,
        content: exercise?.slides,
      });
    }
  }, [slideState, exercise?.slides, navigateToIndex]);

  const onResetPlayingPress = useCallback(
    () => setPlaying(Boolean(sessionState?.playing)),
    [sessionState?.playing, setPlaying],
  );

  const onTogglePlayingPress = useCallback(() => {
    if (currentContentReachedEnd) {
      setPlaying(true);
      setCurrentContentReachedEnd(false);
      conditionallyMuteParticipants(true, slideState?.current);
    } else {
      const playing = !sessionState?.playing;
      setPlaying(playing);
      conditionallyMuteParticipants(playing, slideState?.current);
    }
  }, [
    sessionState?.playing,
    slideState,
    setPlaying,
    currentContentReachedEnd,
    setCurrentContentReachedEnd,
    conditionallyMuteParticipants,
  ]);

  if (!isHost || !exercise || !sessionState || !slideState) {
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

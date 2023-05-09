import React, {useCallback, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import Gutters from '../../../lib/components/Gutters/Gutters';
import SheetModal from '../../../lib/components/Modals/SheetModal';

import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';

import {useIsFocused} from '@react-navigation/native';

import {Spacer16, Spacer8} from '../../../lib/components/Spacers/Spacer';
import Markdown from '../../../lib/components/Typography/Markdown/Markdown';
import IconButton from '../../../lib/components/Buttons/IconButton/IconButton';
import {Pause, Play, RewindIcon} from '../../../lib/components/Icons';
import styled from 'styled-components/native';

import LPlayer, {
  LottiePlayerHandle,
} from '../../../lib/components/LottiePlayer/LottiePlayer';
import VideoLooper from '../../../lib/components/VideoLooper/VideoLooper';
import DurationTimer from '../../../lib/session/components/DurationTimer/DurationTimer';

const LottiePlayer = styled(LPlayer)({
  flex: 1,
});

const ContentWrapper = styled.View({
  width: '100%',
  aspectRatio: '1',
});

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
});

const Duration = styled(DurationTimer)({
  position: 'absolute',
  right: 22,
  top: 16,
  width: 30,
  height: 30,
});

const AudioPlayer = styled(VideoLooper)({
  display: 'none',
});

const CalmDownModal = () => {
  const {t} = useTranslation('Modal.CalmDown');
  const [paused, setPaused] = useState(true);
  const [audioDuration, setAudioDuration] = useState(0);

  const lottieRef = useRef<LottiePlayerHandle>(null);
  const timerRef = useRef<LottiePlayerHandle>(null);
  const videoRef = useRef<VideoLooper>(null);

  const onTogglePlayingPress = useCallback(
    () => setPaused(!paused),
    [setPaused, paused],
  );

  const lottieSrc = useMemo(
    () => ({
      uri: t('lottie.source'),
    }),
    [t],
  );

  const lottieAudioSources = useMemo(
    () => [{source: t('lottie.audio'), repeat: false}],
    [t],
  );

  const seek = useCallback((seconds: number) => {
    videoRef.current?.seek(seconds);
    lottieRef.current?.seek(seconds);
    timerRef.current?.seek(seconds);
  }, []);

  const onLoad = useCallback<(data: {duration: number}) => void>(
    data => setAudioDuration(data.duration),
    [setAudioDuration],
  );

  const onRewindPress = useCallback(() => seek(0), [seek]);

  return (
    <SheetModal>
      <BottomSheetScrollView focusHook={useIsFocused}>
        <Gutters>
          <ModalHeading>{t('title')}</ModalHeading>
          <Spacer16 />
          <ContentWrapper>
            <Duration ref={timerRef} duration={audioDuration} paused={paused} />
            <AudioPlayer
              sources={lottieAudioSources}
              volume={1}
              ref={videoRef}
              onLoad={onLoad}
              paused={paused}
            />
            <LottiePlayer
              ref={lottieRef}
              source={lottieSrc}
              paused={paused}
              repeat={true}
              duration={60}
            />
          </ContentWrapper>
          <Row>
            <IconButton
              small
              elevated
              variant="tertiary"
              Icon={RewindIcon}
              onPress={onRewindPress}
            />
            <Spacer8 />
            <IconButton
              small
              elevated
              variant="tertiary"
              Icon={paused ? Play : Pause}
              onPress={onTogglePlayingPress}
            />
          </Row>
          <Spacer16 />
          <Markdown>{t('body__markdown')}</Markdown>
        </Gutters>
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default CalmDownModal;

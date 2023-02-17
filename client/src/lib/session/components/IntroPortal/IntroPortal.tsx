import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {StyleSheet} from 'react-native';

import {SPACINGS} from '../../../constants/spacings';
import useSessionState from '../../state/state';
import {Exercise} from '../../../../../../shared/src/types/generated/Exercise';
import Screen from '../../../components/Screen/Screen';
import {
  BottomSafeArea,
  Spacer16,
  TopSafeArea,
} from '../../../components/Spacers/Spacer';
import Gutters from '../../../components/Gutters/Gutters';
import IconButton from '../../../components/Buttons/IconButton/IconButton';
import AudioFader from '../AudioFader/AudioFader';
import VideoTransition from '../VideoTransition/VideoTransition';
import HostNotes from '../HostNotes/HostNotes';
import {ArrowLeftIcon} from '../../../components/Icons';
import Button from '../../../components/Buttons/Button';
import LottieTransition from '../VideoTransition/LottieTransition';
import LottiePlayer from '../../../components/LottiePlayer/LottiePlayer';
import AnimatedLottieView from 'lottie-react-native';

const Wrapper = styled.View({
  flex: 1,
  justifyContent: 'space-between',
  zIndex: 1,
});
const Content = styled.View({
  flex: 1,
  justifyContent: 'space-between',
});

const TopBar = styled(Gutters)({
  justifyContent: 'space-between',
  flexDirection: 'row',
});

const BackButton = styled(IconButton)({
  marginLeft: -SPACINGS.SIXTEEN,
});

const LottieStyled = styled(LottiePlayer)(({paused}) => ({
  opacity: paused ? 0 : 1,
  ...StyleSheet.absoluteFillObject,
}));

const StyledLottie = styled(AnimatedLottieView)({
  ...StyleSheet.absoluteFillObject,
});

type IntroPortalProps = {
  exercise: Exercise | null;
  isHost: boolean;
  isFocused: boolean;
  onStartSession: () => void;
  onLeaveSession: () => void;
  onNavigateToSession: () => void;
  statusComponent?: React.ReactNode;
};

const IntroPortal: React.FC<IntroPortalProps> = ({
  exercise,
  isHost,
  isFocused,
  onStartSession,
  onLeaveSession,
  onNavigateToSession,
  statusComponent,
}) => {
  const lottieRef = useRef<AnimatedLottieView>(null);
  const {t} = useTranslation('Screen.Portal');

  const [isReadyForDisplay, setIsReadyForDisplay] = useState(
    Boolean(exercise?.introPortal?.lottieLoop?.source),
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const sessionState = useSessionState(state => state.sessionState);

  const introPortal = exercise?.introPortal;
  const textColor = exercise?.theme?.textColor;

  useEffect(() => {
    lottieRef.current?.pause();
  }, []);

  useEffect(() => {
    if (
      sessionState?.started &&
      !introPortal?.videoLoop?.source &&
      !introPortal?.videoLoop?.source
    ) {
      // If no video is defined, navigate directly
      onNavigateToSession();
    }
  }, [
    sessionState?.started,
    introPortal?.videoLoop?.source,
    introPortal?.lottieLoop?.source,
    onNavigateToSession,
  ]);

  const onVideoReadyForDisplay = useCallback(() => {
    setIsReadyForDisplay(true);
  }, [setIsReadyForDisplay]);

  const onVideoTransition = useCallback(() => {
    setIsTransitioning(true);
    ReactNativeHapticFeedback.trigger('impactHeavy');
  }, [setIsTransitioning]);

  const onVideoEnd = useCallback(() => {
    onNavigateToSession();
  }, [onNavigateToSession]);

  const audioSource = useMemo(() => {
    if (introPortal?.lottieLoop?.audio) {
      return introPortal?.lottieLoop?.audio;
    }
    return introPortal?.videoLoop?.audio;
  }, [introPortal]);

  console.log('REnder');

  return (
    <Screen>
      {!isHost && <TopSafeArea minSize={SPACINGS.SIXTEEN} />}
      {isFocused && audioSource && (
        <AudioFader
          source={audioSource}
          paused={!isReadyForDisplay}
          volume={isTransitioning ? 0 : 1}
          duration={isTransitioning ? 5000 : 10000}
          repeat
        />
      )}
      {introPortal?.lottieLoop?.source ? (
        // <LottieStyled
        //   source={{uri: introPortal?.lottieLoop?.source}}
        //   paused={false}
        //   repeat={false}
        //   duration={10}
        // />
        // <LottieTransition
        //   loopSource={introPortal.lottieLoop.source}
        //   loopDuration={introPortal.lottieLoop.duration}
        //   endSource={introPortal.lottieEnd?.source}
        //   loop={!sessionState?.started}
        //   endDuration={introPortal.lottieEnd?.duration}
        //   onTransition={onVideoTransition}
        //   onEnd={onVideoEnd}
        // />
        <StyledLottie
          onAnimationFinish={onVideoEnd}
          source={{uri: introPortal.lottieLoop.source}}
          speed={10}
          loop={false}
          autoPlay={false}
          // progress={progress}
          resizeMode="contain"
          ref={lottieRef}
        />
      ) : (
        <VideoTransition
          loopSource={introPortal?.videoLoop?.source}
          loopPosterSource={introPortal?.videoLoop?.preview}
          endSource={introPortal?.videoEnd?.source}
          loop={!sessionState?.started}
          paused={!isFocused}
          onReadyForDisplay={onVideoReadyForDisplay}
          onTransition={onVideoTransition}
          onEnd={onVideoEnd}
        />
      )}
      {isHost && (
        <>
          <HostNotes introPortal exercise={exercise} />
          <Spacer16 />
        </>
      )}
      <Wrapper>
        {isFocused && (
          <Content>
            <TopBar>
              <BackButton
                onPress={onLeaveSession}
                fill={textColor}
                Icon={ArrowLeftIcon}
                noBackground
              />
              {__DEV__ && sessionState?.started && (
                <Button small onPress={onNavigateToSession}>
                  {t('skipPortal')}
                </Button>
              )}
              {isHost && (
                <Button
                  small
                  disabled={sessionState?.started}
                  onPress={() => lottieRef.current?.play()}>
                  {sessionState?.started
                    ? t('sessionStarted')
                    : t('startSession')}
                </Button>
              )}
            </TopBar>
            {statusComponent}
          </Content>
        )}
      </Wrapper>
      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </Screen>
  );
};

export default IntroPortal;

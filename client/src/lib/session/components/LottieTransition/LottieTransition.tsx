import React, {useCallback, useMemo, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {StyleSheet} from 'react-native';
import LottiePlayer, {
  LottiePlayerHandle,
} from '../../../components/LottiePlayer/LottiePlayer';

const LottieStyled = styled(LottiePlayer)<{paused: boolean}>(({paused}) => ({
  opacity: paused ? 0 : 1,
  ...StyleSheet.absoluteFillObject,
}));

type LottieTransitionProps = {
  startSource?: string;
  startDuration?: number;
  loopSource?: string;
  loopDuration?: number;
  endSource?: string;
  endDuration?: number;
  loop?: boolean;
  paused?: boolean;
  onTransition?: () => void;
  onReadyForDisplay?: () => void;
  onEnd?: () => void;
};

const LottieTransition: React.FC<LottieTransitionProps> = ({
  startSource,
  startDuration,
  loopSource,
  loopDuration,
  endSource,
  endDuration,
  loop = true,
  paused = false,
  onTransition = () => {},
  onEnd = () => {},
}) => {
  const startVideoRef = useRef<LottiePlayerHandle>(null);
  const loopVideoRef = useRef<LottiePlayerHandle>(null);
  const endVideoRef = useRef<LottiePlayerHandle>(null);
  const [isLooping, setIsLooping] = useState(startSource ? false : true);
  const [isEnding, setIsEnding] = useState(loopSource ? false : true);

  const lottieStartSource = useMemo(() => {
    if (startSource) {
      return {uri: startSource};
    }
  }, [startSource]);

  const lottieLoopSource = useMemo(() => {
    if (loopSource) {
      return {uri: loopSource};
    }
  }, [loopSource]);

  const lottieEndSource = useMemo(() => {
    if (endSource) {
      return {uri: endSource};
    }
  }, [endSource]);

  const onStartEnd = useCallback(() => {
    if (loop) {
      setIsLooping(true);
      onTransition();
    }
  }, [loop, setIsLooping, onTransition]);

  const onLoopEnd = useCallback(() => {
    if (!loop) {
      setIsEnding(true);
      onTransition();
    }
  }, [loop, setIsEnding, onTransition]);

  console.log('duration', loopDuration);

  return (
    <>
      {lottieLoopSource && loopDuration && (
        <LottieStyled
          ref={loopVideoRef}
          source={lottieLoopSource}
          onEnd={onLoopEnd}
          paused={paused || !isLooping}
          repeat={loop}
          duration={loopDuration}
        />
      )}

      {lottieStartSource && startDuration && (
        <LottieStyled
          ref={startVideoRef}
          source={lottieStartSource}
          onEnd={onStartEnd}
          paused={paused || !isLooping}
          repeat={loop}
          duration={startDuration}
        />
      )}

      {lottieEndSource && endDuration && (
        <LottieStyled
          ref={endVideoRef}
          source={lottieEndSource}
          onEnd={onEnd}
          paused={paused || !isEnding}
          repeat={false}
          duration={endDuration}
        />
      )}
    </>
  );
};

export default React.memo(LottieTransition);

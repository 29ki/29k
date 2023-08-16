import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import AnimatedLottieView, {LottieViewProps} from 'lottie-react-native';
import {ViewStyle} from 'react-native';
import useFetchLottie from './hooks/useFetchLottie';

export type LottiePlayerProps = {
  style?: ViewStyle;
  source: LottieViewProps['source'];
  paused: boolean;
  repeat: boolean;
  duration: number;
  onEnd?: () => void;
};

export type LottiePlayerHandle = {
  seek: (seconds: number) => void;
};

// This component wraps Lottie and tries to mimic parts of the react-native-video props and imperative API
const LottiePlayer = forwardRef<LottiePlayerHandle, LottiePlayerProps>(
  ({style, source, paused, onEnd, duration = 60, repeat = false}, ref) => {
    const lottieRef = useRef<AnimatedLottieView>(null);
    const lottieSource = useFetchLottie(source);
    const [progress, setProgress] = useState(0);

    const togglePaused = useCallback((pause: boolean) => {
      if (pause) {
        lottieRef.current?.pause();
      } else {
        lottieRef.current?.resume();
      }
    }, []);

    const seek = useCallback(
      (seconds: number) => {
        if (seconds === 0) {
          // Setting progress to 0 doesn't work
          lottieRef.current?.reset();
        } else {
          // No imperative API for seeking
          setProgress(seconds / duration);
        }
        // Allways pause or resume after seek
        togglePaused(paused);
      },
      [togglePaused, duration, paused],
    );

    const onAnimationFinish = useCallback(
      (isCancelled: boolean) => {
        if (!isCancelled && onEnd) {
          onEnd();
        }
      },
      [onEnd],
    );

    useImperativeHandle(ref, () => ({seek}), [seek]);

    useEffect(() => {
      togglePaused(paused);
    }, [paused, togglePaused]);

    if (!lottieSource) {
      return null;
    }

    return (
      <AnimatedLottieView
        style={style}
        onAnimationFinish={onAnimationFinish}
        source={lottieSource}
        speed={duration ? 60 / duration : 1}
        loop={repeat}
        autoPlay={!paused}
        progress={progress}
        resizeMode="contain"
        ref={lottieRef}
      />
    );
  },
);

export default React.memo(LottiePlayer);

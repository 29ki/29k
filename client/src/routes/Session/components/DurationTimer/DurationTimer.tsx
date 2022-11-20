import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import AnimatedLottieView from 'lottie-react-native';
import timer60s from '../../../../assets/animations/60s-timer.json';
import {View, ViewStyle} from 'react-native';

type DurationTimerProps = {
  style?: ViewStyle;
  paused: boolean;
  duration: number;
};

export type DurationTimerHandle = {
  seek: (seconds: number) => void;
};

const DurationTimer = forwardRef<DurationTimerHandle, DurationTimerProps>(
  ({style, paused, duration = 60}, ref) => {
    const lottieRef = useRef<AnimatedLottieView>(null);
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

    useImperativeHandle(ref, () => ({seek}), [seek]);

    useEffect(() => {
      togglePaused(paused);
    }, [paused, togglePaused]);

    return (
      <View style={style}>
        <AnimatedLottieView
          source={timer60s}
          speed={duration ? 60 / duration : 1}
          loop={false}
          autoPlay={!paused}
          progress={progress}
          resizeMode="contain"
          ref={lottieRef}
        />
      </View>
    );
  },
);

export default DurationTimer;

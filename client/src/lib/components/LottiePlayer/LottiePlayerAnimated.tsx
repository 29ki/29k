import React, {useCallback, useRef, useEffect} from 'react';
import AnimatedLottieView, {AnimatedLottieViewProps} from 'lottie-react-native';
import {View, ViewStyle} from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export type LottiePlayerAnimatedProps = {
  style?: ViewStyle;
  source: AnimatedLottieViewProps['source'];
  paused: boolean;
  repeat: boolean;
  duration: number;
  onEnd?: () => void;
};

// This component wraps Lottie and tries to mimic parts of the react-native-video props and imperative API
const LottiePlayerAnimated: React.FC<LottiePlayerAnimatedProps> = ({
  style,
  source,
  paused,
  onEnd,
  duration = 60,
  repeat = false,
}) => {
  const progress = useSharedValue(0);
  const progressAnimation = useRef(new Animated.Value(0)).current;

  const onProgress = useCallback(
    ({value}: {value: number}) => {
      if (value > 0.9 && onEnd) {
        console.log('onAnimationFinish');
        onEnd();
      }
    },
    [onEnd],
  );

  useEffect(() => {
    console.log('render');

    progress.value = withRepeat(
      withTiming(1, {duration: duration * 1000}, () => console.log('end')),
      repeat ? -1 : 1,
      false,
      () => {
        console.log('repeat ended');
      },
    );
    // const listenerId = progressAnimation.addListener(onProgress);

    // return () => {
    //   progressAnimation.removeListener(listenerId);
    // };
  }, [progress, repeat, duration]);

  return (
    <Animated.View style={style}>
      <AnimatedLottieView
        source={source}
        loop={repeat}
        autoPlay={!paused}
        progress={progress.value}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

export default LottiePlayerAnimated;

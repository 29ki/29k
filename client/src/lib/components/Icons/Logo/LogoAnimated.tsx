import * as React from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {useEffect} from 'react';
import {LogoIcon} from './Logo';

type LogoAnimatedProps = {fill?: string};
export const LogoIconAnimated = React.memo<LogoAnimatedProps>(({fill}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {duration: 30000, easing: Easing.linear}),
      -1,
      false,
    );
  });

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{rotateZ: `${rotation.value}deg`}],
    }),
    [rotation.value],
  );

  return (
    <Animated.View style={animatedStyle}>
      <LogoIcon fill={fill} />
    </Animated.View>
  );
});

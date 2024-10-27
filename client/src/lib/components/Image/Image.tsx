import React from 'react';
import {useCallback} from 'react';
import {ImageProps} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components/native';

const AnimatedImage = styled(Animated.Image)({
  flex: 1,
});

const Image: React.FC<ImageProps> = ({style, ...props}) => {
  const opacity = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
    }),
    [opacity],
  );

  const onLoadEnd = useCallback(() => {
    opacity.value = withTiming(1, {duration: 300});
  }, [opacity]);

  return (
    <AnimatedImage
      onLoadEnd={onLoadEnd}
      style={[style, animatedStyles]}
      {...props}
    />
  );
};

export default Image;

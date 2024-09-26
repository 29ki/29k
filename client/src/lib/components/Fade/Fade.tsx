import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components/native';

const AnimatedView = styled(Animated.View)<{visible: boolean}>(({visible}) => ({
  ...StyleSheet.absoluteFillObject,
  zIndex: visible ? 1 : undefined,
}));

const Fade: React.FC<{
  children: React.ReactNode;
  visible: boolean;
  duration?: number;
}> = ({children, visible, duration = 400}) => {
  const opacity = useSharedValue(visible ? 1 : 0);

  const animatedStyles = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
    }),
    [opacity],
  );

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {duration});
  }, [opacity, visible, duration]);

  return (
    <AnimatedView
      visible={visible}
      style={animatedStyles}
      pointerEvents={visible ? 'auto' : 'none'}>
      {children}
    </AnimatedView>
  );
};

export default React.memo(Fade);

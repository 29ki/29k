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

const Fade: React.FC<{children: React.ReactNode; visible: boolean}> = ({
  children,
  visible,
}) => {
  const opacity = useSharedValue(visible ? 1 : 0);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {duration: 400});
  }, [opacity, visible]);

  return (
    <AnimatedView visible={visible} style={animatedStyles}>
      {children}
    </AnimatedView>
  );
};

export default React.memo(Fade);

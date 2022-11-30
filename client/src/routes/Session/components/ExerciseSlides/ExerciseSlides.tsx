import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {ExerciseSlide} from '../../../../../../shared/src/types/Content';
import {ExerciseTheme} from '../../../../../../shared/src/types/generated/Exercise';
import {StyleSheet} from 'react-native';
import {Slide} from '../Slides/Slide';

const Wrapper = styled.View({
  flex: 1,
});

const AnimatedView = styled(Animated.View)({
  ...StyleSheet.absoluteFillObject,
});

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

  return <AnimatedView style={animatedStyles}>{children}</AnimatedView>;
};

type ExerciseSlidesProps = {
  index: number;
  current: ExerciseSlide;
  previous?: ExerciseSlide;
  next?: ExerciseSlide;
  theme?: ExerciseTheme;
};

const ExerciseSlides: React.FC<ExerciseSlidesProps> = ({
  index = 0,
  current,
  previous,
  next,
  theme,
}) => (
  // "Pre load" previous and next slide
  <Wrapper>
    {previous && (
      <Fade visible={false} key={index - 1}>
        <Slide theme={theme} slide={previous} active={false} />
      </Fade>
    )}
    <Fade visible={true} key={index}>
      <Slide theme={theme} slide={current} active={true} />
    </Fade>
    {next && (
      <Fade visible={false} key={index + 1}>
        <Slide theme={theme} slide={next} active={false} />
      </Fade>
    )}
  </Wrapper>
);

export default ExerciseSlides;

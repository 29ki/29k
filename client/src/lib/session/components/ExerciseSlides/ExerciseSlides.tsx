import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {ExerciseSlide} from '../../../../../../shared/src/types/Content';
import {Slide} from '../Slides/Slide';
import {SessionType} from '../../../../../../shared/src/types/Session';

const Wrapper = styled.View({
  flex: 1,
});

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

type ExerciseSlidesProps = {
  index: number;
  current: ExerciseSlide;
  previous?: ExerciseSlide;
  next?: ExerciseSlide;
  sessionType: SessionType;
};

const ExerciseSlides: React.FC<ExerciseSlidesProps> = ({
  index = 0,
  current,
  previous,
  next,
  sessionType,
}) => (
  // "Pre load" previous and next slide
  <Wrapper>
    {previous && (
      <Fade visible={false} key={index - 1}>
        <Slide
          sessionType={sessionType}
          slide={previous}
          active={false}
          key="slide"
        />
      </Fade>
    )}
    <Fade visible={true} key={index}>
      <Slide
        sessionType={sessionType}
        slide={current}
        active={true}
        key="slide"
      />
    </Fade>
    {next && (
      <Fade visible={false} key={index + 1}>
        <Slide
          sessionType={sessionType}
          slide={next}
          active={false}
          key="slide"
        />
      </Fade>
    )}
  </Wrapper>
);

export default ExerciseSlides;

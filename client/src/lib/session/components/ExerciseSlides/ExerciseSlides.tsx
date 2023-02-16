import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {ExerciseSlide} from '../../../../../../shared/src/types/Content';
import Slide from '../Slides/Slide';

const Wrapper = styled.View({
  flex: 1,
});

const AnimatedView = styled(Animated.View)<{visible: boolean}>(({visible}) => ({
  ...StyleSheet.absoluteFillObject,
  zIndex: visible ? 1 : undefined,
}));

const Fade: React.FC<{children: React.ReactNode; visible: boolean}> =
  React.memo(({children, visible}) => {
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
  });

Fade.displayName = 'Fade';

type ExerciseSlidesProps = {
  index: number;
  current: ExerciseSlide;
  previous?: ExerciseSlide;
  next?: ExerciseSlide;
  async?: boolean;
};

const ExerciseSlides: React.FC<ExerciseSlidesProps> = ({
  index = 0,
  current,
  previous,
  next,
  async,
}) => (
  // "Pre load" previous and next slide
  <Wrapper>
    {previous && (
      <Fade visible={false} key={index - 1}>
        <Slide async={async} slide={previous} active={false} key="slide" />
      </Fade>
    )}
    <Fade visible={true} key={index}>
      <Slide async={async} slide={current} active={true} key="slide" />
    </Fade>
    {next && (
      <Fade visible={false} key={index + 1}>
        <Slide async={async} slide={next} active={false} key="slide" />
      </Fade>
    )}
  </Wrapper>
);

export default React.memo(ExerciseSlides);

import React from 'react';
import styled from 'styled-components/native';

import {ExerciseSlide} from '../../../../../../shared/src/types/Content';
import Fade from '../../../components/Fade/Fade';
import Slide from '../Slides/Slide';

const Wrapper = styled.View({
  flex: 1,
});

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

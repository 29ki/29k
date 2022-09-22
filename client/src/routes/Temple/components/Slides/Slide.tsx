import React from 'react';
import styled from 'styled-components/native';
import {ExerciseSlide} from '../../../../../../shared/src/types/Content';
import ParticipantSpotlight from './Slides/ParticipantSpotlight';
import {COLORS} from '../../../../common/constants/colors';
import Content from './Slides/Content';

const Wrapper = styled.View({
  flex: 1,
  backgroundColor: COLORS.WHITE,
});

type SlideProps = {
  slide: ExerciseSlide;
  active: boolean;
};

export const Slide = React.memo(({slide, active}: SlideProps) => (
  <Wrapper>
    {slide.type === 'participantSpotlight' && (
      <ParticipantSpotlight active={active} />
    )}
    {slide.type === 'content' && <Content slide={slide} active={active} />}
    {slide.type === 'reflection' && <Content slide={slide} active={active} />}
    {slide.type === 'sharing' && <Content slide={slide} active={active} />}
  </Wrapper>
));

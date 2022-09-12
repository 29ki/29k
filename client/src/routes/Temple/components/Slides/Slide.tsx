import React from 'react';
import styled from 'styled-components/native';
import {ExerciseSlide} from '../../../../../../shared/src/types/Content';
import ParticipantSpotlight from './Slides/ParticipantSpotlight';
import {COLORS} from '../../../../common/constants/colors';
import Content from './Slides/Content';

const Wrapper = styled.View({
  flex: 1,
  backgroundColor: COLORS.WHITE_EASY,
});

type SlideProps = {
  slide: ExerciseSlide;
  playing: boolean;
};

export const Slide = React.memo(({slide, playing}: SlideProps) => (
  <Wrapper>
    {slide.type === 'participantSpotlight' && <ParticipantSpotlight />}
    {slide.type === 'content' && <Content slide={slide} playing={playing} />}
    {slide.type === 'reflection' && <Content slide={slide} playing={playing} />}
    {slide.type === 'sharing' && <Content slide={slide} playing={playing} />}
  </Wrapper>
));

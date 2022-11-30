import React from 'react';
import styled from 'styled-components/native';
import {ExerciseSlide} from '../../../../../../shared/src/types/Content';
import Host from './Slides/Host';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Content from './Slides/Content';

type WrapperProps = {backgroundColor?: string};
const Wrapper = styled.View<WrapperProps>(({backgroundColor}) => ({
  flex: 1,
  backgroundColor: backgroundColor ?? COLORS.WHITE,
}));

type SlideProps = {
  slide: ExerciseSlide;
  active: boolean;
  backgroundColor?: string;
};

export const Slide = React.memo(
  ({slide, active, backgroundColor}: SlideProps) => {
    return (
      <Wrapper backgroundColor={backgroundColor}>
        {slide.type === 'host' && <Host active={active} />}
        {slide.type === 'content' && <Content slide={slide} active={active} />}
        {slide.type === 'reflection' && (
          <Content slide={slide} active={active} />
        )}
        {slide.type === 'sharing' && <Content slide={slide} active={active} />}
      </Wrapper>
    );
  },
);

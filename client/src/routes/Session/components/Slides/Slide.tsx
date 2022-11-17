import React from 'react';
import styled from 'styled-components/native';
import {ExerciseSlide} from '../../../../../../shared/src/types/Content';
import Host from './Slides/Host';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Content from './Slides/Content';
import useSessionExercise from '../../hooks/useSessionExercise';

type WrapperProps = {backgroundColor?: string};
const Wrapper = styled.View<WrapperProps>(({backgroundColor}) => ({
  flex: 1,
  backgroundColor: backgroundColor ?? COLORS.WHITE,
}));

type SlideProps = {
  slide: ExerciseSlide;
  active: boolean;
  hasHostNotes?: boolean;
};

export const Slide = React.memo(({slide, active, hasHostNotes}: SlideProps) => {
  const exercise = useSessionExercise();
  return (
    <Wrapper backgroundColor={exercise?.theme?.backgroundColor}>
      {slide.type === 'host' && <Host active={active} />}
      {slide.type === 'content' && (
        <Content hasHostNotes={hasHostNotes} slide={slide} active={active} />
      )}
      {slide.type === 'reflection' && (
        <Content hasHostNotes={hasHostNotes} slide={slide} active={active} />
      )}
      {slide.type === 'sharing' && (
        <Content hasHostNotes={hasHostNotes} slide={slide} active={active} />
      )}
    </Wrapper>
  );
});

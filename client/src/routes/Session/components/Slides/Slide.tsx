import React from 'react';
import styled from 'styled-components/native';
import {ExerciseSlide} from '../../../../../../shared/src/types/Content';
import Host from './Slides/Host';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Content from './Slides/Content';
import {ExerciseTheme} from '../../../../../../shared/src/types/generated/Exercise';

type WrapperProps = {backgroundColor?: string};
const Wrapper = styled.View<WrapperProps>(({backgroundColor}) => ({
  flex: 1,
  backgroundColor: backgroundColor ?? COLORS.WHITE,
}));

type SlideProps = {
  slide: ExerciseSlide;
  active: boolean;
  theme?: ExerciseTheme;
};

export const Slide = React.memo(({slide, active, theme}: SlideProps) => {
  return (
    <Wrapper backgroundColor={theme?.backgroundColor}>
      {slide.type === 'host' && (
        <Host backgroundColor={theme?.backgroundColor} active={active} />
      )}
      {slide.type === 'content' && (
        <Content textColor={theme?.textColor} slide={slide} active={active} />
      )}
      {slide.type === 'reflection' && (
        <Content textColor={theme?.textColor} slide={slide} active={active} />
      )}
      {slide.type === 'sharing' && (
        <Content textColor={theme?.textColor} slide={slide} active={active} />
      )}
    </Wrapper>
  );
});

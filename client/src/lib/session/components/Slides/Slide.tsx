import React from 'react';
import styled from 'styled-components/native';

import {ExerciseSlide} from '../../../../../../shared/src/types/Content';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Content from './Slides/Content';

import useExerciseTheme from '../../hooks/useExerciseTheme';

import Host from './Slides/Host';
import HostVideo from './Slides/HostVideo';
import {SessionType} from '../../../../../../shared/src/types/Session';

type WrapperProps = {backgroundColor?: string};
const Wrapper = styled.View<WrapperProps>(({backgroundColor}) => ({
  flex: 1,
  backgroundColor: backgroundColor ?? COLORS.WHITE,
}));

type SlideProps = {
  slide: ExerciseSlide;
  active: boolean;
  sessionType: SessionType;
};

export const Slide = React.memo(({slide, active, sessionType}: SlideProps) => {
  const theme = useExerciseTheme();

  return (
    <Wrapper backgroundColor={theme?.backgroundColor}>
      {slide.type === 'host' &&
        (sessionType === SessionType.async ? (
          <HostVideo active={active} slide={slide} />
        ) : (
          <Host active={active} />
        ))}
      {slide.type === 'content' && <Content slide={slide} active={active} />}
      {slide.type === 'reflection' && <Content slide={slide} active={active} />}
      {slide.type === 'sharing' && <Content slide={slide} active={active} />}
    </Wrapper>
  );
});

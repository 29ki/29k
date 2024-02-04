import React from 'react';
import styled from 'styled-components/native';

import {ExerciseSlide} from '../../../../../../shared/src/types/Content';
import {ExerciseSlideInstructionSlide} from '../../../../../../shared/src/types/generated/Exercise';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import useSessionState from '../../state/state';

import Content from './Slides/Content';
import Host from './Slides/Host';
import Sharing from './Slides/Sharing';
import Instruction from './Slides/Instruction';

type WrapperProps = {backgroundColor?: string};
const Wrapper = styled.View<WrapperProps>(({backgroundColor}) => ({
  flex: 1,
  backgroundColor: backgroundColor ?? COLORS.WHITE,
  justifyContent: 'center',
}));

type SlideProps = {
  slide: ExerciseSlide;
  active: boolean;
  async?: boolean;
};

const Slide = ({slide, active, async}: SlideProps) => {
  const theme = useSessionState(state => state.exercise?.theme);

  return (
    <Wrapper backgroundColor={theme?.backgroundColor}>
      {slide.type === 'host' && <Host active={active} />}
      {slide.type === 'content' && (
        <Content async={async} slide={slide} active={active} />
      )}
      {slide.type === 'reflection' && (
        <Content async={async} slide={slide} active={active} />
      )}
      {slide.type === 'sharing' &&
        (async ? (
          <Sharing slide={slide} />
        ) : (
          <Content async={async} slide={slide} active={active} />
        ))}
      {slide.type === 'instruction' && (
        <Instruction slide={slide as ExerciseSlideInstructionSlide} />
      )}
    </Wrapper>
  );
};

export default React.memo(Slide);

import React, {useMemo} from 'react';
import styled from 'styled-components/native';
import hexToRgba from 'hex-to-rgba';
import LinearGradient from 'react-native-linear-gradient';

import {ExerciseSlide} from '../../../../../../shared/src/types/Content';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Content from './Slides/Content';

import useExerciseTheme from '../../hooks/useExerciseTheme';

import Host from './Slides/Host';
import HostVideo from './Slides/HostVideo';
import Sharing from './Slides/Sharing';

type WrapperProps = {backgroundColor?: string};
const Wrapper = styled.View<WrapperProps>(({backgroundColor}) => ({
  flex: 1,
  backgroundColor: backgroundColor ?? COLORS.WHITE,
  justifyContent: 'center',
}));

const BottomVideoGradient = styled(LinearGradient)({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 80,
});

type SlideProps = {
  slide: ExerciseSlide;
  active: boolean;
  async?: boolean;
};

export const Slide = React.memo(({slide, active, async}: SlideProps) => {
  const theme = useExerciseTheme();
  const background = theme?.backgroundColor ?? COLORS.WHITE;
  const colors = useMemo(
    () => [hexToRgba(background, 0), hexToRgba(background, 1)],
    [background],
  );

  return (
    <Wrapper backgroundColor={theme?.backgroundColor}>
      {slide.type === 'host' &&
        (async ? (
          <>
            <HostVideo active={active} slide={slide} />
            <BottomVideoGradient colors={colors} />
          </>
        ) : (
          <Host active={active} />
        ))}
      {slide.type === 'content' && (
        <Content async={async} slide={slide} active={active} />
      )}
      {slide.type === 'reflection' && (
        <Content async={async} slide={slide} active={active} />
      )}
      {slide.type === 'sharing' &&
        (async ? (
          <Sharing />
        ) : (
          <Content async={async} slide={slide} active={active} />
        ))}
    </Wrapper>
  );
});

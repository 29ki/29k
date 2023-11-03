import hexToRgba from 'hex-to-rgba';
import React from 'react';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';
import styled from 'styled-components/native';

const FADE_HEIGHT = 36;

type FadeProps = {
  color: string;
};
const Fade = styled(LinearGradient).attrs({
  pointerEvents: 'none',
})<FadeProps>({
  position: 'absolute',
  height: FADE_HEIGHT,
  left: 0,
  right: 0,
  backgroundColor: 'none',
});

const TopFade = styled(Fade).attrs<FadeProps, LinearGradientProps>(
  ({color}) => ({
    colors: [hexToRgba(color, 0), hexToRgba(color, 1)],
  }),
)({
  top: 0,
});

const BottomFade = styled(Fade).attrs<FadeProps, LinearGradientProps>(
  ({color}) => ({
    colors: [hexToRgba(color, 1), hexToRgba(color, 0)],
  }),
)({
  bottom: 0,
});

const Background = styled.View<{backgroundColor: string}>(
  ({backgroundColor}) => ({
    position: 'absolute',
    top: FADE_HEIGHT,
    bottom: FADE_HEIGHT,
    left: 0,
    right: 0,
    backgroundColor,
  }),
);

const Wrapper = styled.View({
  minHeight: FADE_HEIGHT * 2,
  justifyContent: 'center',
});

type Props = {
  backgroundColor: string;
  children: React.ReactNode;
};

const BackgroundBlock: React.FC<Props> = ({backgroundColor, children}) => (
  <Wrapper>
    <Background backgroundColor={backgroundColor} />
    <TopFade color={backgroundColor} />
    <BottomFade color={backgroundColor} />
    {children}
  </Wrapper>
);

export default BackgroundBlock;

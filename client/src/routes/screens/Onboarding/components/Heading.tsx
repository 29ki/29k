import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {Display36} from '../../../../lib/components/Typography/Display/Display';
import Svg, {
  SvgProps,
  Ellipse,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';

const Container = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: -1,
});

const Gradient = (props: SvgProps) => (
  <Svg viewBox="0 0 355 274" {...props}>
    <Ellipse cx={177.5} cy={137} fill="url(#a)" rx={177.5} ry={137} />
    <Defs>
      <RadialGradient
        id="a"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(0 137 -177.5 0 177.5 137)"
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#1F282F" />
        <Stop offset={0.38} stopColor="#1F282F" stopOpacity={0.6} />
        <Stop offset={1} stopColor="#1F282F" stopOpacity={0} />
      </RadialGradient>
    </Defs>
  </Svg>
);

const Background = styled(Gradient)({
  position: 'absolute',
  width: '200%',
  height: '300%',
});

const StyledHeading = styled(Display36)({
  color: COLORS.PURE_WHITE,
  textAlign: 'center',
});

const Heading: React.FC<{children: React.ReactNode}> = ({children}) => (
  <Container>
    <Background />
    <StyledHeading>{children}</StyledHeading>
  </Container>
);

export default Heading;

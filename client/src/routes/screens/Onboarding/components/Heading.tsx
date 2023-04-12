import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {Display36} from '../../../../lib/components/Typography/Display/Display';
import BackgroundGradient from './BackgroundGradient';

const Container = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: -1,
});

const Background = styled(BackgroundGradient)({
  position: 'absolute',
  width: '100%',
  height: '200%',
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

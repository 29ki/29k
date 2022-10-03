import React from 'react';
import styled from 'styled-components/native';
import Gutters from '../../../../../../common/components/Gutters/Gutters';
import {Spacer12} from '../../../../../../common/components/Spacers/Spacer';
import {Display16} from '../../../../../../common/components/Typography/Display/Display';

const StyledText = styled(Display16)({
  textAlign: 'center',
});

const Text: React.FC<{children: React.ReactNode}> = ({children}) => (
  <Gutters>
    <Spacer12 />
    <StyledText>{children}</StyledText>
    <Spacer12 />
  </Gutters>
);

export default Text;

import React from 'react';
import styled from 'styled-components/native';
import Gutters from '../../../../../../common/components/Gutters/Gutters';
import {Spacer4} from '../../../../../../common/components/Spacers/Spacer';
import {Display16} from '../../../../../../common/components/Typography/Display/Display';

const StyledText = styled(Display16)({
  textAlign: 'center',
});

const Text: React.FC<{children: React.ReactNode}> = ({children}) => (
  <Gutters>
    <Spacer4 />
    <StyledText numberOfLines={2}>{children}</StyledText>
  </Gutters>
);

export default Text;

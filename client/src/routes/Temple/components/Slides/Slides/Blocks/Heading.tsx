import React from 'react';
import styled from 'styled-components/native';
import Gutters from '../../../../../../common/components/Gutters/Gutters';
import {Spacer12} from '../../../../../../common/components/Spacers/Spacer';
import {Display24} from '../../../../../../common/components/Typography/Display/Display';

const StyledHeading = styled(Display24)({
  textAlign: 'center',
});

const Heading: React.FC<{children: React.ReactNode}> = ({children}) => (
  <Gutters>
    <Spacer12 />
    <StyledHeading numberOfLines={2}>{children}</StyledHeading>
  </Gutters>
);

export default Heading;

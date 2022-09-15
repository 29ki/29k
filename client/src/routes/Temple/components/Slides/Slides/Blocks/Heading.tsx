import React from 'react';
import styled from 'styled-components/native';
import {Spacer12} from '../../../../../../common/components/Spacers/Spacer';
import {H2} from '../../../../../../common/components/Typography/Heading/Heading';

const StyledHeading = styled(H2)({
  textAlign: 'center',
});

const Heading: React.FC<{children: React.ReactNode}> = ({children}) => (
  <>
    <Spacer12 />
    <StyledHeading>{children}</StyledHeading>
    <Spacer12 />
  </>
);

export default Heading;

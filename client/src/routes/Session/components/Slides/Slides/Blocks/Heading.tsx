import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../../../shared/src/constants/colors';
import Gutters from '../../../../../../common/components/Gutters/Gutters';
import {Spacer12} from '../../../../../../common/components/Spacers/Spacer';
import {Display24} from '../../../../../../common/components/Typography/Display/Display';

type StyledHeadingProp = {textColor?: string};
const StyledHeading = styled(Display24)<StyledHeadingProp>(({textColor}) => ({
  textAlign: 'center',
  color: textColor ?? COLORS.BLACK,
}));

const Heading: React.FC<{children: React.ReactNode; textColor?: string}> = ({
  children,
  textColor,
}) => {
  return (
    <Gutters>
      <Spacer12 />
      <StyledHeading textColor={textColor} numberOfLines={2}>
        {children}
      </StyledHeading>
    </Gutters>
  );
};

export default Heading;

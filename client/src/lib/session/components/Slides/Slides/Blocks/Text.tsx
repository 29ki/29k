import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../../../shared/src/constants/colors';
import Gutters from '../../../../../components/Gutters/Gutters';
import {Spacer4} from '../../../../../components/Spacers/Spacer';

import {Body16} from '../../../../../components/Typography/Body/Body';
import useSessionState from '../../../../state/state';

type StyledTextProp = {textColor?: string};
const StyledText = styled(Body16)<StyledTextProp>(({textColor}) => ({
  textAlign: 'center',
  color: textColor ?? COLORS.BLACK,
}));

const Text: React.FC<{children: React.ReactNode}> = ({children}) => {
  const theme = useSessionState(state => state.exercise?.theme);

  return (
    <Gutters>
      <Spacer4 />
      <StyledText textColor={theme?.textColor}>{children}</StyledText>
    </Gutters>
  );
};

export default React.memo(Text);

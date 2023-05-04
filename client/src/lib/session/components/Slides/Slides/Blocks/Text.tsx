import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../../../shared/src/constants/colors';
import Gutters from '../../../../../components/Gutters/Gutters';
import {Spacer4} from '../../../../../components/Spacers/Spacer';
import {Display16} from '../../../../../components/Typography/Display/Display';
import useSessionState from '../../../../state/state';

type StyledTextProp = {textColor?: string};
const StyledText = styled(Display16)<StyledTextProp>(({textColor}) => ({
  textAlign: 'center',
  color: textColor ?? COLORS.BLACK,
}));

const Text: React.FC<{children: React.ReactNode; multiline?: boolean}> = ({
  children,
  multiline = false,
}) => {
  const theme = useSessionState(state => state.exercise?.theme);

  return (
    <Gutters>
      <Spacer4 />
      <StyledText
        textColor={theme?.textColor}
        numberOfLines={multiline ? undefined : 2}>
        {children}
      </StyledText>
    </Gutters>
  );
};

export default React.memo(Text);

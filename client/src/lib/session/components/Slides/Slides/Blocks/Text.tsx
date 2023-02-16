import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../../../shared/src/constants/colors';
import Gutters from '../../../../../components/Gutters/Gutters';
import {Spacer4} from '../../../../../components/Spacers/Spacer';
import {Display16} from '../../../../../components/Typography/Display/Display';
import useExerciseTheme from '../../../../hooks/useExerciseTheme';

type StyledTextProp = {textColor?: string};
const StyledText = styled(Display16)<StyledTextProp>(({textColor}) => ({
  textAlign: 'center',
  color: textColor ?? COLORS.BLACK,
}));

const Text: React.FC<{children: React.ReactNode}> = ({children}) => {
  const theme = useExerciseTheme();

  return (
    <Gutters>
      <Spacer4 />
      <StyledText textColor={theme?.textColor} numberOfLines={2}>
        {children}
      </StyledText>
    </Gutters>
  );
};

export default React.memo(Text);

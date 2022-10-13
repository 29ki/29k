import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../../../shared/src/constants/colors';
import useSessionExercise from '../../../../hooks/useSessionExercise';
import Gutters from '../../../../../../common/components/Gutters/Gutters';
import {Spacer4} from '../../../../../../common/components/Spacers/Spacer';
import {Display16} from '../../../../../../common/components/Typography/Display/Display';

type StyledTextProp = {textColor?: string};
const StyledText = styled(Display16)<StyledTextProp>(({textColor}) => ({
  textAlign: 'center',
  color: textColor ?? COLORS.BLACK,
}));

const Text: React.FC<{children: React.ReactNode}> = ({children}) => {
  const exercise = useSessionExercise();

  return (
    <Gutters>
      <Spacer4 />
      <StyledText textColor={exercise?.theme?.textColor} numberOfLines={2}>
        {children}
      </StyledText>
    </Gutters>
  );
};

export default Text;

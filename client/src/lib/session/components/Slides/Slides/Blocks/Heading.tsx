import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../../../shared/src/constants/colors';
import Gutters from '../../../../../components/Gutters/Gutters';
import {Spacer12} from '../../../../../components/Spacers/Spacer';
import {Display24} from '../../../../../components/Typography/Display/Display';
import useSessionState from '../../../../state/state';
import useExerciseTheme from '../../../../../content/hooks/useExerciseTheme';

type StyledHeadingProp = {textColor?: string};
const StyledHeading = styled(Display24)<StyledHeadingProp>(({textColor}) => ({
  textAlign: 'center',
  color: textColor ?? COLORS.BLACK,
}));

const Heading: React.FC<{children: React.ReactNode}> = ({children}) => {
  const exercise = useSessionState(state => state.exercise);
  const theme = useExerciseTheme(exercise);

  return (
    <Gutters>
      <Spacer12 />
      <StyledHeading textColor={theme?.textColor} numberOfLines={2}>
        {children}
      </StyledHeading>
    </Gutters>
  );
};

export default React.memo(Heading);

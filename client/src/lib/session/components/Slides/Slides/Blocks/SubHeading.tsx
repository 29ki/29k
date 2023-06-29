import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../../../shared/src/constants/colors';
import Gutters from '../../../../../components/Gutters/Gutters';
import {Spacer4} from '../../../../../components/Spacers/Spacer';
import {Display16} from '../../../../../components/Typography/Display/Display';
import useSessionState from '../../../../state/state';
import useExerciseTheme from '../../../../../content/hooks/useExerciseTheme';

type StyledSubHeadingProps = {textColor?: string};
const StyledSubHeading = styled(Display16)<StyledSubHeadingProps>(
  ({textColor}) => ({
    textAlign: 'center',
    color: textColor ?? COLORS.BLACK,
  }),
);

const SubHeading: React.FC<{
  children: React.ReactNode;
}> = ({children}) => {
  const exercise = useSessionState(state => state.exercise);
  const theme = useExerciseTheme(exercise);

  return (
    <Gutters>
      <Spacer4 />
      <StyledSubHeading textColor={theme?.textColor} numberOfLines={2}>
        {children}
      </StyledSubHeading>
    </Gutters>
  );
};

export default React.memo(SubHeading);

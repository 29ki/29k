import styled from 'styled-components/native';
import {SPACINGS} from '../../constants/spacings';
import {COLORS} from '../../../../../shared/src/constants/colors';

const Progress = styled.View<{color?: string; percentage: number}>(
  ({color, percentage}) => ({
    width: `${percentage * 100}%`,
    backgroundColor: color ? color : COLORS.BLACK,
    borderRadius: SPACINGS.EIGHT,
    minWidth: 6,
    maxWidth: '100%',
  }),
);

export default Progress;

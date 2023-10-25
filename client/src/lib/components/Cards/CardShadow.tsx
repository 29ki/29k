import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';

const CardShadow = styled.View({
  shadowColor: COLORS.BLACK,
  shadowOffset: `0 -${SPACINGS.EIGHT}px`,
  shadowRadius: 20,
  shadowOpacity: 0.1,
  elevation: 5,
});

export default CardShadow;

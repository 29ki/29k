import styled from 'styled-components';
import {COLORS} from '../../../../../../shared/src/constants/colors';

const Wrapper = styled.div<{backgroundColor?: string}>(({backgroundColor}) => ({
  position: 'relative',
  height: '100%',
  width: '100%',
  backgroundColor: backgroundColor ?? COLORS.WHITE,
}));

export default Wrapper;

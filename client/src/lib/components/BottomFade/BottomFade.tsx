import hexToRgba from 'hex-to-rgba';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';

const BottomFade = styled(LinearGradient).attrs({
  colors: [hexToRgba(COLORS.WHITE, 0), hexToRgba(COLORS.WHITE, 1)],
  pointerEvents: 'none',
})({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 80,
});

export default BottomFade;

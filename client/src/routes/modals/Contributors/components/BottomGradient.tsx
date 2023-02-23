import hexToRgba from 'hex-to-rgba';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';

export const BottomGradient = styled(LinearGradient).attrs({
  colors: [hexToRgba(COLORS.WHITE, 0), hexToRgba(COLORS.WHITE, 1)],
})({
  position: 'absolute',
  height: 80,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1,
});

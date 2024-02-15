import hexToRgba from 'hex-to-rgba';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';

export const BottomGradient = styled(LinearGradient).attrs({
  colors: [hexToRgba(COLORS.WHITE, 0), hexToRgba(COLORS.WHITE, 1)],
  // Fixes issue with types not being passed down properly from .attrs
})<Optional<LinearGradientProps, 'colors'>>({
  position: 'absolute',
  height: 80,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1,
});

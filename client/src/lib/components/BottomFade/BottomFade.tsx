import hexToRgba from 'hex-to-rgba';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';

type Props = {
  color?: string;
};
const BottomFade = styled(LinearGradient).attrs<Props, LinearGradientProps>(
  ({color = COLORS.WHITE}) => ({
    colors: [hexToRgba(color, 0), hexToRgba(color, 1)],
    pointerEvents: 'none',
  }),
)<Props>({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 80,
});

export default BottomFade;

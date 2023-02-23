import hexToRgba from 'hex-to-rgba';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {GUTTERS} from '../../../../lib/constants/spacings';

export const Header = styled(LinearGradient).attrs({
  colors: [
    hexToRgba(COLORS.WHITE, 1),
    hexToRgba(COLORS.WHITE, 1),
    hexToRgba(COLORS.WHITE, 0),
  ],
})({
  position: 'absolute',
  height: 120,
  left: GUTTERS.SMALL,
  right: GUTTERS.SMALL,
  zIndex: 1,
});

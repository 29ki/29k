import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {GUTTERS} from '../../constants/spacings';
import {COLORS} from '../../../../../shared/src/constants/colors';
import hexToRgba from 'hex-to-rgba';

export const HEIGHT = 40;

type Props = {
  backgroundColor?: string;
};

const StickyHeading = styled(LinearGradient).attrs<Props>(
  ({backgroundColor = COLORS.PURE_WHITE}) => ({
    colors: [
      hexToRgba(backgroundColor, 1),
      hexToRgba(backgroundColor, 0.9),
      hexToRgba(backgroundColor, 0),
    ],
  }),
)<Optional<LinearGradientProps, 'colors'>>({
  // Fixes issue with types not being passed down properly from .attrs
  minHeight: HEIGHT,
  paddingHorizontal: GUTTERS.SMALL,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'none',
});

export default StickyHeading;

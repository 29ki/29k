import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {GUTTERS} from '../../constants/spacings';
import {COLORS} from '../../../../../shared/src/constants/colors';
import hexToRgba from 'hex-to-rgba';

type Props = {
  backgroundColor?: string;
};

const StickyHeading = styled(LinearGradient).attrs<Props, LinearGradientProps>(
  ({backgroundColor = COLORS.WHITE}) => ({
    colors: [
      hexToRgba(backgroundColor, 1),
      hexToRgba(backgroundColor, 0.9),
      hexToRgba(backgroundColor, 0),
    ],
  }),
)<Props>({
  height: 40,
  paddingHorizontal: GUTTERS.SMALL,
  justifyContent: 'center',
  backgroundColor: 'none',
});

export default StickyHeading;

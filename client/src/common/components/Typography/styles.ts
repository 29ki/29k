import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import {
  HKGroteskBold,
  HKGroteskMedium,
  OrpheusProMedium,
} from '../../constants/fonts';

const textStyles = StyleSheet.create({
  H1: {
    color: COLORS.BLACK,
    fontSize: 40,
    fontFamily: OrpheusProMedium,
  },
  H2: {
    color: COLORS.BLACK,
    fontSize: 32,
    fontFamily: OrpheusProMedium,
  },
  H3: {
    color: COLORS.BLACK,
    fontSize: 24,
    fontFamily: OrpheusProMedium,
  },
  H4: {
    color: COLORS.BLACK,
    fontSize: 20,
    fontFamily: OrpheusProMedium,
  },
  H5: {
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: OrpheusProMedium,
  },
  B1: {
    color: COLORS.BLACK,
    fontSize: 20,
    fontFamily: HKGroteskMedium,
  },
  B2: {
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: HKGroteskMedium,
  },
  B3: {
    color: COLORS.BLACK,
    fontSize: 14,
    fontFamily: HKGroteskMedium,
  },
  ERROR_TEXT: {
    fontSize: 14,
    color: COLORS.ERROR,
  },
  HIGHLIGHT: {
    color: COLORS.ACTIVE,
  },
  NAV_TAB: {
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: HKGroteskBold,
  },
  TEXTLINK: {
    color: COLORS.ACTIVE,
    fontSize: 14,
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
});

export default textStyles;

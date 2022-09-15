import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import {
  HKGroteskBold,
  HKGroteskMedium,
  OrpheusProMedium,
} from '../../constants/fonts';

const textStyles = StyleSheet.create({
  H1: {
    color: COLORS.GREY,
    fontSize: 40,
    fontFamily: OrpheusProMedium,
  },
  H2: {
    color: COLORS.GREY,
    fontSize: 32,
    fontFamily: OrpheusProMedium,
  },
  H3: {
    color: COLORS.GREY,
    fontSize: 24,
    fontFamily: OrpheusProMedium,
  },
  H4: {
    color: COLORS.GREY,
    fontSize: 20,
    fontFamily: OrpheusProMedium,
  },
  H5: {
    color: COLORS.GREY,
    fontSize: 16,
    fontFamily: OrpheusProMedium,
  },
  B1: {
    color: COLORS.GREY,
    fontSize: 20,
    fontFamily: HKGroteskMedium,
  },
  B2: {
    color: COLORS.GREY,
    fontSize: 16,
    fontFamily: HKGroteskMedium,
  },
  B3: {
    color: COLORS.GREY,
    fontSize: 14,
    fontFamily: HKGroteskMedium,
  },
  ERROR_TEXT: {
    fontSize: 14,
    color: COLORS.ERROR_PINK,
  },
  HIGHLIGHT: {
    color: COLORS.ROSE700,
  },
  NAV_TAB: {
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: HKGroteskBold,
  },
  TEXTLINK: {
    color: COLORS.ROSE700,
    fontSize: 14,
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
});

export default textStyles;

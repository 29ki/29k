import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import {
  HKGroteskBold,
  HKGroteskRegular,
  PlayfairDisplayRegular,
} from '../../constants/fonts';

const textStyles = StyleSheet.create({
  Display36: {
    color: COLORS.BLACK,
    fontSize: 36,
    fontFamily: PlayfairDisplayRegular,
  },
  Display28: {
    color: COLORS.BLACK,
    fontSize: 28,
    fontFamily: PlayfairDisplayRegular,
  },
  Display24: {
    color: COLORS.BLACK,
    fontSize: 24,
    fontFamily: PlayfairDisplayRegular,
  },
  Display22: {
    color: COLORS.BLACK,
    fontSize: 22,
    fontFamily: PlayfairDisplayRegular,
  },
  Display18: {
    color: COLORS.BLACK,
    fontSize: 18,
    fontFamily: PlayfairDisplayRegular,
  },
  Display16: {
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: PlayfairDisplayRegular,
  },
  Display14: {
    color: COLORS.BLACK,
    fontSize: 14,
    fontFamily: PlayfairDisplayRegular,
  },
  H24: {
    color: COLORS.BLACK,
    fontSize: 24,
    fontFamily: HKGroteskBold,
  },
  H22: {
    color: COLORS.BLACK,
    fontSize: 22,
    fontFamily: HKGroteskBold,
  },
  H18: {
    color: COLORS.BLACK,
    fontSize: 18,
    fontFamily: HKGroteskBold,
  },
  H16: {
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: HKGroteskBold,
  },
  B18: {
    color: COLORS.BLACK,
    fontSize: 18,
    fontFamily: HKGroteskRegular,
  },
  B16: {
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: HKGroteskRegular,
  },
  B14: {
    color: COLORS.BLACK,
    fontSize: 14,
    fontFamily: HKGroteskRegular,
  },
  NAV_TAB: {
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: HKGroteskBold,
  },
  ERROR_TEXT: {
    fontSize: 14,
    color: COLORS.ERROR,
  },
  HIGHLIGHT: {
    color: COLORS.ACTIVE,
  },
  TEXTLINK: {
    color: COLORS.ACTIVE,
    fontSize: 14,
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
});

export default textStyles;

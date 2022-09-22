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
    lineHeight: 48,
    fontFamily: PlayfairDisplayRegular,
  },
  Display28: {
    color: COLORS.BLACK,
    fontSize: 28,
    lineHeight: 37,
    fontFamily: PlayfairDisplayRegular,
  },
  Display24: {
    color: COLORS.BLACK,
    fontSize: 24,
    lineHeight: 33,
    fontFamily: PlayfairDisplayRegular,
  },
  Display22: {
    color: COLORS.BLACK,
    fontSize: 22,
    lineHeight: 29,
    fontFamily: PlayfairDisplayRegular,
  },
  Display18: {
    color: COLORS.BLACK,
    fontSize: 18,
    lineHeight: 24,
    fontFamily: PlayfairDisplayRegular,
  },
  Display16: {
    color: COLORS.BLACK,
    fontSize: 16,
    lineHeight: 21,
    fontFamily: PlayfairDisplayRegular,
  },
  Display14: {
    color: COLORS.BLACK,
    fontSize: 14,
    lineHeight: 19,
    fontFamily: PlayfairDisplayRegular,
  },
  H24: {
    color: COLORS.BLACK,
    fontSize: 24,
    lineHeight: 31,
    fontFamily: HKGroteskBold,
  },
  H22: {
    color: COLORS.BLACK,
    fontSize: 22,
    lineHeight: 29,
    fontFamily: HKGroteskBold,
  },
  H18: {
    color: COLORS.BLACK,
    fontSize: 18,
    lineHeight: 23,
    fontFamily: HKGroteskBold,
  },
  H16: {
    color: COLORS.BLACK,
    fontSize: 16,
    lineHeight: 21,
    fontFamily: HKGroteskBold,
  },
  B18: {
    color: COLORS.BLACK,
    fontSize: 18,
    lineHeight: 23,
    fontFamily: HKGroteskRegular,
  },
  B16: {
    color: COLORS.BLACK,
    fontSize: 16,
    lineHeight: 21,
    fontFamily: HKGroteskRegular,
  },
  B14: {
    color: COLORS.BLACK,
    fontSize: 14,
    lineHeight: 18,
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
    fontSize: 16,
    lineHeight: 21,
    textDecorationLine: 'underline',
    fontFamily: HKGroteskRegular,
  },
});

export default textStyles;

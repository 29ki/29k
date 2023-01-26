import {StyleSheet} from 'react-native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {
  HKGroteskBold,
  HKGroteskItalic,
  HKGroteskMedium,
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
  Display20: {
    color: COLORS.BLACK,
    fontSize: 20,
    lineHeight: 27,
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
  Heading24: {
    color: COLORS.BLACK,
    fontSize: 24,
    lineHeight: 31,
    fontFamily: HKGroteskBold,
  },
  Heading22: {
    color: COLORS.BLACK,
    fontSize: 22,
    lineHeight: 29,
    fontFamily: HKGroteskBold,
  },
  Heading18: {
    color: COLORS.BLACK,
    fontSize: 18,
    lineHeight: 23,
    fontFamily: HKGroteskBold,
  },
  Heading16: {
    color: COLORS.BLACK,
    fontSize: 16,
    lineHeight: 21,
    fontFamily: HKGroteskBold,
  },
  ModalHeading: {
    color: COLORS.BLACK,
    fontSize: 16,
    lineHeight: 21,
    textAlign: 'center',
    fontFamily: HKGroteskMedium,
  },
  Body18: {
    color: COLORS.BLACK,
    fontSize: 18,
    lineHeight: 23,
    fontFamily: HKGroteskRegular,
  },
  Body16: {
    color: COLORS.BLACK,
    fontSize: 16,
    lineHeight: 21,
    fontFamily: HKGroteskRegular,
  },
  Body14: {
    color: COLORS.BLACK,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: HKGroteskRegular,
  },
  Body12: {
    color: COLORS.BLACK,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: HKGroteskRegular,
  },
  BodyBold: {
    fontFamily: HKGroteskBold,
  },
  BodyItalic: {
    fontFamily: HKGroteskItalic,
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
    textDecorationLine: 'underline',
  },
});

export default textStyles;

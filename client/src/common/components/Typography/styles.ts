import {Platform, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

const fontFamily = Platform.select({ios: 'Times New Roman', android: 'serif'});

export default StyleSheet.create({
  H1: {
    color: COLORS.GREY,
    fontSize: 40,
    lineHeight: 48,
    fontFamily,
  },
  H2: {
    color: COLORS.GREY,
    fontSize: 32,
    lineHeight: 41,
    fontFamily,
  },
  H3: {
    color: COLORS.GREY,
    fontSize: 24,
    lineHeight: 31,
    fontFamily,
  },
  H4: {
    color: COLORS.GREY,
    fontSize: 20,
    lineHeight: 28,
    fontFamily,
  },
  H5: {
    color: COLORS.GREY,
    fontSize: 16,
    lineHeight: 22,
    fontFamily,
  },
  B1: {
    color: COLORS.GREY,
    fontSize: 20,
    lineHeight: 26,
  },
  B2: {
    color: COLORS.GREY,
    fontSize: 16,
    lineHeight: 18,
  },
  B3: {
    color: COLORS.GREY,
    fontSize: 14,
    lineHeight: 16,
  },
  ERROR_TEXT: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.ERROR_PINK,
  },
  HIGHLIGHT: {
    color: COLORS.ROSE700,
  },
  NAV_TAB: {
    color: COLORS.BLACK,
    fontSize: 16,
  },
  TEXTLINK: {
    color: COLORS.ROSE700,
    fontSize: 14,
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
});

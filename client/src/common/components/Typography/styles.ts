import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export default StyleSheet.create({
  H1: {
    color: COLORS.GREY800,
    fontSize: 40,
    lineHeight: 48,
  },
  H2: {
    color: COLORS.GREY800,
    fontSize: 32,
    lineHeight: 41,
  },
  H3: {
    color: COLORS.GREY800,
    fontSize: 24,
    lineHeight: 31,
  },
  H4: {
    color: COLORS.GREY800,
    fontSize: 20,
    lineHeight: 28,
  },
  H5: {
    color: COLORS.GREY800,
    fontSize: 16,
    lineHeight: 22,
  },
  B1: {
    color: COLORS.GREY800,
    fontSize: 16,
    lineHeight: 22,
  },
  B2: {
    color: COLORS.GREY800,
    fontSize: 14,
    lineHeight: 20,
  },
  B3: {
    color: COLORS.GREY500,
    fontSize: 14,
    lineHeight: 20,
    textTransform: 'uppercase',
  },
  ERROR_TEXT: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.ERROR_PINK,
  },
  HIGHLIGHT: {
    color: COLORS.PEACH100,
  },
  NAV_TAB: {
    fontSize: 14,
    textTransform: 'uppercase',
  },
});

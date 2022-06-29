import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export default StyleSheet.create({
  HEADING1: {
    color: COLORS.GREY800,
    fontSize: 40,
    lineHeight: 48,
  },
  HEADING2: {
    color: COLORS.GREY800,
    fontSize: 32,
    lineHeight: 41,
  },
  HEADING3: {
    color: COLORS.GREY800,
    fontSize: 24,
    lineHeight: 31,
  },
  HEADING4: {
    color: COLORS.GREY800,
    fontSize: 20,
    lineHeight: 28,
  },
  BODY_NORMAL: {
    fontSize: 16,
    lineHeight: 22,
  },
  BODY_SMALL: {
    fontSize: 14,
    lineHeight: 20,
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

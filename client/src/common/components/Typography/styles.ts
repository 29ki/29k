import {Platform} from 'react-native';
import {COLORS} from '../../constants/colors';

const fontFamily = Platform.select({ios: 'Times New Roman', android: 'serif'});

export default {
  H1: {
    color: COLORS.GREY,
    fontSize: 40,
    lineHeight: '48px',
    fontFamily,
  },
  H2: {
    color: COLORS.GREY,
    fontSize: 32,
    lineHeight: '41px',
    fontFamily,
  },
  H3: {
    color: COLORS.GREY,
    fontSize: 24,
    lineHeight: '31px',
    fontFamily,
  },
  H4: {
    color: COLORS.GREY,
    fontSize: 20,
    lineHeight: '28px',
    fontFamily,
  },
  H5: {
    color: COLORS.GREY,
    fontSize: 16,
    lineHeight: '22px',
    fontFamily,
  },
  B1: {
    color: COLORS.GREY,
    fontSize: 20,
    lineHeight: '26px',
    padding: 1,
  },
  B2: {
    color: COLORS.GREY,
    fontSize: 16,
    lineHeight: '18px',
  },
  B3: {
    color: COLORS.GREY,
    fontSize: 14,
    lineHeight: '16px',
  },
  ERROR_TEXT: {
    fontSize: 14,
    lineHeight: '20px',
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
    lineHeight: '20px',
    textDecorationLine: 'underline',
  },
};

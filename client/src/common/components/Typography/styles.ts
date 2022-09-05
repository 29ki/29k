import {Platform, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

const OrpheusProRegular = Platform.select({
  ios: 'Orpheus Pro',
  android: 'Orpheus Pro Regular',
});
const OrpheusProMedium = 'Orpheus Pro Medium';
const OrpheusProBold = 'Orpheus Pro Bold';
const OrpheusProItalic = 'Orpheus Pro Italic';

export default StyleSheet.create({
  H1: {
    color: COLORS.GREY,
    fontSize: 40,
    lineHeight: 48,
    fontFamily: OrpheusProMedium,
  },
  H2: {
    color: COLORS.GREY,
    fontSize: 32,
    lineHeight: 41,
    fontFamily: OrpheusProMedium,
  },
  H3: {
    color: COLORS.GREY,
    fontSize: 24,
    lineHeight: 31,
    fontFamily: OrpheusProMedium,
  },
  H4: {
    color: COLORS.GREY,
    fontSize: 20,
    lineHeight: 28,
    fontFamily: OrpheusProMedium,
  },
  H5: {
    color: COLORS.GREY,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: OrpheusProMedium,
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

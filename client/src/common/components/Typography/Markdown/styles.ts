import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants/colors';
import {SPACINGS} from '../../../constants/spacings';
import baseStyles from '../styles';

const styles = StyleSheet.create({
  heading1: baseStyles.H1,
  heading2: baseStyles.H2,
  heading3: baseStyles.H3,
  heading4: baseStyles.H4,
  heading5: baseStyles.H5,
  paragraph: {
    ...baseStyles.B1,
    marginTop: 0,
    marginBottom: 0,
  },
  textgroup: {
    color: COLORS.GREY800,
  },
  s: {
    ...baseStyles.HIGHLIGHT,
    textDecorationLine: 'none',
  },
  bullet_list_icon: {
    fontSize: 0,
    width: 6,
    height: 6,
    marginTop: 6,
    marginLeft: 2,
    marginRight: 14,
    borderRadius: 3,
    backgroundColor: COLORS.ROSE700,
    overflow: 'hidden',
  },
  ordered_list_icon: {
    ...baseStyles.B1,
    color: COLORS.ROSE700,
    minWidth: 13,
    marginLeft: 0,
    marginRight: 9,
    lineHeight: SPACINGS.TWENTYFOUR,
    marginTop: -4,
  },
  hr: {
    marginTop: 15,
    marginBottom: 25,
    backgroundColor: COLORS.GREY800,
  },
});

export default styles;

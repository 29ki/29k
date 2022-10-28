import {StyleSheet} from 'react-native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../constants/spacings';
import baseStyles from '../styles';

const styles = StyleSheet.create({
  heading1: baseStyles.Display36,
  heading2: baseStyles.Display28,
  heading3: baseStyles.Display22,
  heading4: baseStyles.Display18,
  paragraph: {
    ...baseStyles.Body16,
    marginTop: 0,
    marginBottom: 0,
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
    backgroundColor: COLORS.ACTIVE,
    overflow: 'hidden',
  },
  ordered_list_icon: {
    ...baseStyles.Body18,
    color: COLORS.ACTIVE,
    minWidth: 13,
    marginLeft: 0,
    marginRight: 9,
    lineHeight: SPACINGS.TWENTYFOUR,
    marginTop: -SPACINGS.FOUR,
  },
  hr: {
    marginTop: 15,
    marginBottom: 25,
    backgroundColor: COLORS.GREYDARK,
  },
  blockquote: {
    paddingHorizontal: SPACINGS.EIGHT,
    paddingTop: SPACINGS.EIGHT,
    marginLeft: 0,
    borderLeftWidth: 0,
    backgroundColor: 'transparent',
  },
  blockquote_background: {
    borderRadius: SPACINGS.EIGHT,
    backgroundColor: COLORS.GREYLIGHTER,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: SPACINGS.EIGHT,
  },
});

export default styles;

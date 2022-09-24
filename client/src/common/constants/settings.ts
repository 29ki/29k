import {Platform} from 'react-native';
import {SPACINGS} from './spacings';

export const SETTINGS = {
  BORDER_RADIUS: {
    CARDS: SPACINGS.TWENTYFOUR,
  },
  BOXSHADOW: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: {width: 0, height: SPACINGS.FOUR},
      shadowOpacity: 0.16,
      shadowRadius: SPACINGS.TWELVE,
    },
    android: {elevation: SPACINGS.TWELVE},
  }),
};

export default SETTINGS;

import {Platform} from 'react-native';
import {SPACINGS} from './spacings';

export const SETTINGS = {
  BORDER_RADIUS: {
    CARDS: SPACINGS.TWENTYFOUR,
  },
  BOXSHADOW: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: `0 ${SPACINGS.FOUR}px`,
      shadowOpacity: 0.16,
      shadowRadius: SPACINGS.TWELVE,
    },
    android: {elevation: SPACINGS.TWELVE},
  }),
};

export default SETTINGS;

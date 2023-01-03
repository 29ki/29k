import {SPACINGS} from './spacings';

export const SETTINGS = {
  BORDER_RADIUS: {
    CARDS: SPACINGS.TWENTYFOUR,
    ACTION_LISTS: SPACINGS.SIXTEEN,
    MODALS: 41,
  },
  BOXSHADOW: {
    shadowColor: '#000000',
    shadowOffset: `0 ${SPACINGS.FOUR}px`,
    shadowOpacity: 0.16,
    shadowRadius: SPACINGS.TWELVE,
    elevation: SPACINGS.TWELVE,
  },
};

export default SETTINGS;

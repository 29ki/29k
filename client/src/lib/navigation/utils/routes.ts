import {navigationRef} from '../Navigation';

export const getCurrentRouteName = () => {
  const route = navigationRef.getCurrentRoute();

  if (route?.params && 'screen' in route.params) {
    return route.params.screen;
  }

  return route?.name;
};

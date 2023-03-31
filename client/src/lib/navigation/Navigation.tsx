import React from 'react';
import {
  createNavigationContainerRef,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';

import {COLORS} from '../../../../shared/src/constants/colors';
import linking from './linking';
import {RootNavigationProps} from './constants/routes';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.WHITE,
  },
};

export const navigationRef =
  createNavigationContainerRef<RootNavigationProps>();

const Navigation: React.FC<{children: React.ReactNode}> = ({children}) => (
  <NavigationContainer theme={navTheme} linking={linking} ref={navigationRef}>
    {children}
  </NavigationContainer>
);

export default Navigation;

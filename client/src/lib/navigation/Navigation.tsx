import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';

import {COLORS} from '../../../../shared/src/constants/colors';
import linking from './linking';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.WHITE,
  },
};

const Navigation: React.FC<{children: React.ReactNode}> = ({children}) => (
  <NavigationContainer theme={navTheme} linking={linking}>
    {children}
  </NavigationContainer>
);

export default Navigation;

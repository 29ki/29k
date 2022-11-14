import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';

import {COLORS} from '../../../../shared/src/constants/colors';
import ModalStack from './ModalStack';
import linking from './linking';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.WHITE,
  },
};

const Navigation = () => (
  <NavigationContainer theme={navTheme} linking={linking}>
    <ModalStack />
  </NavigationContainer>
);

export default Navigation;

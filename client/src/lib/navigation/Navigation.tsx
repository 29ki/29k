import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';

import {COLORS} from '../../common/constants/colors';
import Stacks from './Stacks';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.WHITE,
  },
};

const Navigation = () => {
  return (
    <NavigationContainer theme={navTheme}>
      <Stacks />
    </NavigationContainer>
  );
};

export default Navigation;

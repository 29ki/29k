import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {AsyncSessionStackProps} from './constants/routes';
import Session from '../../routes/screens/AsyncSession/Session';
import IntroPortal from '../../routes/screens/AsyncSession/IntroPortal';
import OutroPortal from '../../routes/screens/AsyncSession/OutroPortal';

const {Navigator, Screen} =
  createNativeStackNavigator<AsyncSessionStackProps>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'fade',
  animationDuration: 2000,
  gestureEnabled: false,
};

const AsyncSessionStack = () => (
  <Navigator screenOptions={screenOptions}>
    <Screen name={'IntroPortal'} component={IntroPortal} />
    <Screen name={'Session'} component={Session} />
    <Screen name={'OutroPortal'} component={OutroPortal} />
  </Navigator>
);

export default AsyncSessionStack;

import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {AsyncSessionStackProps} from './constants/routes';
import Session from '../../routes/Session/Async/Session';
import IntroPortal from '../../routes/Session/Async/IntroPortal';
import OutroPortal from '../../routes/Session/Async/OutroPortal';
import DailyProvider from '../daily/DailyProvider';

const {Navigator, Screen} =
  createNativeStackNavigator<AsyncSessionStackProps>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'fade',
  animationDuration: 2000,
  gestureEnabled: false,
};

const AsyncSessionStack = () => (
  <DailyProvider>
    <Navigator screenOptions={screenOptions}>
      <Screen name={'IntroPortal'} component={IntroPortal} />
      <Screen name={'Session'} component={Session} />
      <Screen name={'OutroPortal'} component={OutroPortal} />
    </Navigator>
  </DailyProvider>
);

export default AsyncSessionStack;

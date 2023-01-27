import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {OnlineSessionStackProps} from './constants/routes';
import Session from '../../routes/Session/Online/Session';
import ChangingRoom from '../../routes/Session/Online/ChangingRoom';
import IntroPortal from '../../routes/Session/Online/IntroPortal';
import OutroPortal from '../../routes/Session/Online/OutroPortal';
import DailyProvider from '../daily/DailyProvider';

const {Navigator, Screen} =
  createNativeStackNavigator<OnlineSessionStackProps>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'fade',
  animationDuration: 2000,
  gestureEnabled: false,
};

const OnlineSessionStack = () => (
  <DailyProvider>
    <Navigator screenOptions={screenOptions}>
      <Screen name={'ChangingRoom'} component={ChangingRoom} />
      <Screen name={'IntroPortal'} component={IntroPortal} />
      <Screen name={'Session'} component={Session} />
      <Screen name={'OutroPortal'} component={OutroPortal} />
    </Navigator>
  </DailyProvider>
);

export default OnlineSessionStack;

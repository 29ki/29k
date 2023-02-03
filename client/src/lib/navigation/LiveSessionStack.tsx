import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {LiveSessionStackProps} from './constants/routes';
import Session from '../../routes/LiveSession/Session';
import ChangingRoom from '../../routes/LiveSession/ChangingRoom';
import IntroPortal from '../../routes/LiveSession/IntroPortal';
import OutroPortal from '../../routes/LiveSession/OutroPortal';
import DailyProvider from '../daily/DailyProvider';

const {Navigator, Screen} = createNativeStackNavigator<LiveSessionStackProps>();

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

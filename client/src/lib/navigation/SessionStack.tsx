import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {SessionStackProps} from './constants/routes';
import Session from '../../routes/Session/Session';
import ChangingRoom from '../../routes/Session/ChangingRoom';
import IntroPortal from '../../routes/Session/IntroPortal';
import OutroPortal from '../../routes/Session/OutroPortal';
import DailyProvider from '../daily/DailyProvider';

const {Navigator, Screen} = createNativeStackNavigator<SessionStackProps>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'fade',
  animationDuration: 2000,
  gestureEnabled: false,
};

const SessionStack = () => (
  <DailyProvider>
    <Navigator screenOptions={screenOptions}>
      <Screen name={'ChangingRoom'} component={ChangingRoom} />
      <Screen name={'IntroPortal'} component={IntroPortal} />
      <Screen name={'Session'} component={Session} />
      <Screen name={'OutroPortal'} component={OutroPortal} />
    </Navigator>
  </DailyProvider>
);

export default SessionStack;

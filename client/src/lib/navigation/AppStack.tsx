import React from 'react';
import KillSwitch from '../../routes/KillSwitch/KillSwitch';
import useKillSwitchState from '../killSwitch/state/state';
import Tabs from './Tabs';
import useNavigationState from './state/state';
import LiveSessionStack from './LiveSessionStack';
import AsyncSessionStack from './AsyncSessionStack';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {AppStackProps} from './constants/routes';
import Welcome from '../../routes/Onboarding/Welcome';
import useAppState from '../appState/state/state';

const {Navigator, Screen, Group} = createNativeStackNavigator<AppStackProps>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
};

const slideScreenOptions: NativeStackNavigationOptions = {
  ...screenOptions,
  animation: 'slide_from_bottom',
  gestureEnabled: false,
};

const fadeScreenOptions: NativeStackNavigationOptions = {
  ...screenOptions,
  animation: 'fade',
  animationDuration: 2000,
  gestureEnabled: false,
};

const AppStack = () => {
  const isBlocking = useKillSwitchState(state => state.isBlocking);
  const fade = useNavigationState(state => state.navigateWithFade);
  const settings = useAppState(state => state.settings);

  return (
    // set this state using useNavigationWithFade to change animation to fade
    <Navigator screenOptions={slideScreenOptions}>
      {isBlocking ? (
        <Screen name={'KillSwitch'} component={KillSwitch} />
      ) : settings.showWelcome ? (
        <Screen name={'Welcome'} component={Welcome} />
      ) : (
        <Group screenOptions={fade ? fadeScreenOptions : screenOptions}>
          <Screen name={'Tabs'} component={Tabs} />
          <Screen
            name={'LiveSessionStack'}
            component={LiveSessionStack}
            options={{gestureEnabled: false}}
          />
          <Screen
            name={'AsyncSessionStack'}
            component={AsyncSessionStack}
            options={{gestureEnabled: false}}
          />
        </Group>
      )}
    </Navigator>
  );
};

export default AppStack;

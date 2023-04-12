import React from 'react';
import KillSwitch from '../../routes/screens/KillSwitch/KillSwitch';
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
import EarlyAccessInfo from '../../routes/screens/EarlyAccessInfo/EarlyAccessInfo';
import useAppState from '../appState/state/state';
import Onboarding from '../../routes/screens/Onboarding/Onboarding';
import Start from '../../routes/screens/Onboarding/Start';

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
    <Navigator
      screenOptions={slideScreenOptions}
      initialRouteName={settings.showOnboarding ? 'Start' : 'Tabs'}>
      {isBlocking ? (
        <Screen name="KillSwitch" component={KillSwitch} />
      ) : (
        <>
          <Group screenOptions={fadeScreenOptions}>
            <Screen name="Start" component={Start} />
            <Screen
              name="Onboarding"
              component={Onboarding}
              options={fadeScreenOptions}
            />
          </Group>
          <Group screenOptions={fade ? fadeScreenOptions : screenOptions}>
            <Screen name="Tabs" component={Tabs} />
            <Screen
              name="LiveSessionStack"
              component={LiveSessionStack}
              options={{gestureEnabled: false}}
            />
            <Screen
              name="AsyncSessionStack"
              component={AsyncSessionStack}
              options={{gestureEnabled: false}}
            />
          </Group>
        </>
      )}
    </Navigator>
  );
};

export default AppStack;

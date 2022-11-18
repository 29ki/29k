import React from 'react';
import KillSwitch from '../../routes/KillSwitch/KillSwitch';
import useKillSwitchState from '../killSwitch/state/state';
import Tabs from './Tabs';
import useNavigationState from './state/state';
import SessionStackWrapper from './SessionStack';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {AppStackProps} from './constants/routes';

const AppStack = createNativeStackNavigator<AppStackProps>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

const fadeScreenOptions: NativeStackNavigationOptions = {
  ...screenOptions,
  animation: 'fade',
  animationDuration: 2000,
  gestureEnabled: false,
};

const AppStackWrapper = () => {
  const isBlocking = useKillSwitchState(state => state.isBlocking);
  const fade = useNavigationState(state => state.navigateWithFade);

  return (
    // set this state using useNavigationWithFade to change animation to fade
    <AppStack.Navigator
      screenOptions={fade ? fadeScreenOptions : screenOptions}>
      {isBlocking ? (
        <AppStack.Screen name={'KillSwitch'} component={KillSwitch} />
      ) : (
        <>
          <AppStack.Screen name={'Tabs'} component={Tabs} />
          <AppStack.Screen
            name={'SessionStack'}
            component={SessionStackWrapper}
            options={{gestureEnabled: false}}
          />
        </>
      )}
    </AppStack.Navigator>
  );
};

export default AppStackWrapper;

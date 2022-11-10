import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import {RootStackProps, SessionStackProps} from './constants/routes';
import KillSwitch from '../../routes/KillSwitch/KillSwitch';
import useKillSwitchState from '../killSwitch/state/state';
import Tabs from './Tabs';
import Session from '../../routes/Session/Session';
import ChangingRoom from '../../routes/Session/ChangingRoom';
import IntroPortal from '../../routes/Session/IntroPortal';
import OutroPortal from '../../routes/Session/OutroPortal';
import DailyProvider from '../daily/DailyProvider';
import SessionModal from '../../routes/SessionModal/SessionModal';
import CreateSessionModal from '../../routes/CreateSessionModal/CreateSessionModal';
import JoinSessionModal from '../../routes/JoinSessionModal/JoinSessionModal';
import useNavigationState from './state/state';
import UpgradeAccountModal from '../../routes/UpgradeAccountModal/UpgradeAccountModal';
import AddSessionModal from '../../routes/AddSessionModal/AddSessionModal';
import SessionUnavailableModal from '../../routes/SessionUnavailableModal/SessionUnavailableModal';

const RootStack = createNativeStackNavigator<RootStackProps>();
const SessionStack = createNativeStackNavigator<SessionStackProps>();

const stackOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

const fadeStackOptions: NativeStackNavigationOptions = {
  ...stackOptions,
  animation: 'fade',
  animationDuration: 2000,
  gestureEnabled: false,
};

const SessionStackWrapper = () => (
  <DailyProvider>
    <SessionStack.Navigator screenOptions={fadeStackOptions}>
      <SessionStack.Screen name={'ChangingRoom'} component={ChangingRoom} />
      <SessionStack.Screen name={'IntroPortal'} component={IntroPortal} />
      <SessionStack.Screen name={'Session'} component={Session} />
      <SessionStack.Screen name={'OutroPortal'} component={OutroPortal} />
    </SessionStack.Navigator>
  </DailyProvider>
);

const RootStackWrapper = () => {
  const isBlocking = useKillSwitchState(state => state.isBlocking);
  const fade = useNavigationState(state => state.navigateWithFade);

  return (
    // set this state using useNavigationWithFade to change animation to fade
    <RootStack.Navigator screenOptions={fade ? fadeStackOptions : stackOptions}>
      {isBlocking ? (
        <RootStack.Screen name={'KillSwitch'} component={KillSwitch} />
      ) : (
        <>
          <RootStack.Screen name={'Tabs'} component={Tabs} />
          <RootStack.Screen
            name={'SessionStack'}
            component={SessionStackWrapper}
            options={{gestureEnabled: false}}
          />

          <RootStack.Group
            screenOptions={{
              presentation: 'transparentModal',
              gestureDirection: 'vertical',
              gestureEnabled: true,
              animation: 'slide_from_bottom',
            }}>
            <RootStack.Screen name={'SessionModal'} component={SessionModal} />
            <RootStack.Screen
              name={'CreateSessionModal'}
              component={CreateSessionModal}
            />
            <RootStack.Screen
              name={'JoinSessionModal'}
              component={JoinSessionModal}
            />
            <RootStack.Screen
              name={'AddSessionModal'}
              component={AddSessionModal}
            />
            <RootStack.Screen
              name={'UpgradeAccountModal'}
              component={UpgradeAccountModal}
            />
            <RootStack.Screen
              name={'SessionUnavailableModal'}
              component={SessionUnavailableModal}
            />
          </RootStack.Group>
        </>
      )}
    </RootStack.Navigator>
  );
};

export default RootStackWrapper;

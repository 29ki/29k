import React, {createContext} from 'react';
import {LayoutChangeEvent} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {createBottomSheetNavigator} from '@th3rdwave/react-navigation-bottom-sheet';

import {
  ModalStackProps,
  AppStackProps,
  SessionStackProps,
} from './constants/routes';
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

const ModalStack = createBottomSheetNavigator<ModalStackProps>();
const AppStack = createNativeStackNavigator<AppStackProps>();
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

const AppStackWrapper = () => {
  const isBlocking = useKillSwitchState(state => state.isBlocking);
  const fade = useNavigationState(state => state.navigateWithFade);

  return (
    // set this state using useNavigationWithFade to change animation to fade
    <AppStack.Navigator screenOptions={fade ? fadeStackOptions : stackOptions}>
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
export const NavigationContext = createContext<{
  handleContentLayout?: (event: LayoutChangeEvent) => void;
}>({});

const RootStackWrapper = () => {
  return (
    <ModalStack.Navigator screenOptions={{snapPoints: ['30%']}}>
      <ModalStack.Screen name="App" component={AppStackWrapper} />

      <ModalStack.Screen name={'SessionModal'} component={SessionModal} />
      <ModalStack.Screen
        name={'CreateSessionModal'}
        component={CreateSessionModal}
        options={{snapPoints: ['30%', '75%']}}
      />
      <ModalStack.Screen
        name={'JoinSessionModal'}
        component={JoinSessionModal}
      />
      <ModalStack.Screen name={'AddSessionModal'} component={AddSessionModal} />
      <ModalStack.Screen
        name={'UpgradeAccountModal'}
        component={UpgradeAccountModal}
      />
      <ModalStack.Screen
        name={'SessionUnavailableModal'}
        component={SessionUnavailableModal}
      />
    </ModalStack.Navigator>
  );
};

export default RootStackWrapper;

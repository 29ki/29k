import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {useRecoilValue} from 'recoil';

import {RootStackProps, SessionStackProps} from './constants/routes';
import KillSwitch from '../../routes/KillSwitch/KillSwitch';
import {killSwitchFields} from '../killSwitch/state/state';
import Tabs from './Tabs';
import Session from '../../routes/Session/Session';
import ChangingRoom from '../../routes/Session/ChangingRoom';
import IntroPortal from '../../routes/Session/IntroPortal';
import OutroPortal from '../../routes/Session/OutroPortal';
import DailyProvider from '../../routes/Session/DailyProvider';
import SessionModal from '../../routes/Sessions/components/SessionModal';
import CreateSessionModal from '../../routes/Sessions/components/CreateSessionModal';
import JoinSessionModal from '../../routes/Sessions/components/JoinSessionModal';
import {navigationWithFadeAtom} from './state/state';
import UpgradeAccountModal from '../../routes/UpgradeAccountModal/UpgradeAccountModal';
import AddSessionModal from '../../routes/Sessions/components/AddSessionModal';

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
  const isBlocking = useRecoilValue(killSwitchFields('isBlocking'));
  const fade = useRecoilValue(navigationWithFadeAtom);

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
              name={'UpgradeAccount'}
              component={UpgradeAccountModal}
            />
          </RootStack.Group>
        </>
      )}
    </RootStack.Navigator>
  );
};

export default RootStackWrapper;

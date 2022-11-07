import React, {useMemo} from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {createBottomSheetNavigator} from '@th3rdwave/react-navigation-bottom-sheet';
import {useBottomSheetDynamicSnapPoints} from '@gorhom/bottom-sheet';
import {useRecoilValue} from 'recoil';

import {
  ModalStackProps,
  AppStackProps,
  SessionStackProps,
} from './constants/routes';
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
import UpgradeAccount from '../../routes/Profile/UpgradeAccount';
import AddSessionModal from '../../routes/Sessions/components/AddSessionModal';

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
  const isBlocking = useRecoilValue(killSwitchFields('isBlocking'));
  const fade = useRecoilValue(navigationWithFadeAtom);

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

const RootStackWrapper = () => {
  const initialSnapPoints = useMemo(() => ['25%', 'CONTENT_HEIGHT'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  return (
    <ModalStack.Navigator
      screenOptions={{
        snapPoints: animatedSnapPoints,
        handleHeight: animatedHandleHeight,
        contentHeight: animatedContentHeight,
      }}>
      <ModalStack.Screen name="App" component={AppStackWrapper} />

      <ModalStack.Screen name={'SessionModal'} component={SessionModal} />
      <ModalStack.Screen
        name={'CreateSessionModal'}
        component={CreateSessionModal}
      />
      <ModalStack.Screen
        name={'JoinSessionModal'}
        component={JoinSessionModal}
      />
      <ModalStack.Screen name={'AddSessionModal'} component={AddSessionModal} />
      <ModalStack.Screen name={'UpgradeAccount'} component={UpgradeAccount} />
    </ModalStack.Navigator>
  );
};

export default RootStackWrapper;

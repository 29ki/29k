import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useRecoilValue} from 'recoil';

import {RootStackProps, TempleStackProps} from '../../common/constants/routes';
import KillSwitch from '../../routes/KillSwitch/KillSwitch';
import {killSwitchFields} from '../killSwitch/state/state';
import Tabs from './Tabs';
import Temple from '../../routes/Temple/Temple';
import ChangingRoom from '../../routes/Temple/ChangingRoom';
import IntroPortal from '../../routes/Temple/IntroPortal';
import OutroPortal from '../../routes/Temple/OutroPortal';
import DailyProvider from '../../routes/Temple/DailyProvider';
import TempleModal from '../../routes/Temples/components/TempleModal';
import {navigationWithFadeAtom} from './state/state';

const RootStack = createNativeStackNavigator<RootStackProps>();
const TempleStack = createNativeStackNavigator<TempleStackProps>();

const stackOptions = {
  headerShown: false,
};

const TempleStackWrapper = () => (
  <DailyProvider>
    <TempleStack.Navigator
      screenOptions={{
        ...stackOptions,
        animation: 'fade',
        animationDuration: 2000,
        gestureEnabled: false,
      }}>
      <TempleStack.Screen name={'ChangingRoom'} component={ChangingRoom} />
      <TempleStack.Screen name={'IntroPortal'} component={IntroPortal} />
      <TempleStack.Screen name={'Temple'} component={Temple} />
      <TempleStack.Screen name={'OutroPortal'} component={OutroPortal} />
    </TempleStack.Navigator>
  </DailyProvider>
);

const RootStackWrapper = () => {
  const isBlocking = useRecoilValue(killSwitchFields('isBlocking'));
  const fade = useRecoilValue(navigationWithFadeAtom);

  return (
    <RootStack.Navigator
      screenOptions={
        fade ? {...stackOptions, animation: 'fade'} : stackOptions
      }>
      {isBlocking ? (
        <RootStack.Screen name={'KillSwitch'} component={KillSwitch} />
      ) : (
        <>
          <RootStack.Screen name={'Tabs'} component={Tabs} />
          <RootStack.Screen
            name={'TempleStack'}
            component={TempleStackWrapper}
            options={{gestureEnabled: false}}
          />

          <RootStack.Group
            screenOptions={{
              presentation: 'transparentModal',
              gestureDirection: 'vertical',
              gestureEnabled: true,
            }}>
            <RootStack.Screen name={'TempleModal'} component={TempleModal} />
          </RootStack.Group>
        </>
      )}
    </RootStack.Navigator>
  );
};

export default RootStackWrapper;

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NAVIGATORS, ROUTES, ScreenProps} from '../../common/constants/routes';
import KillSwitch from '../../routes/KillSwitch/KillSwitch';
import {useRecoilValue} from 'recoil';
import {killSwitchFields} from '../killSwitch/state/state';
import Tabs from './Tabs';
import Breathing from '../../routes/Breathing/Breathing';

const Stack = createNativeStackNavigator<ScreenProps>();

const stackOptions = {
  headerShown: false,
};

const Stacks = () => {
  const isBlocking = useRecoilValue(killSwitchFields('isBlocking'));

  return (
    <Stack.Navigator screenOptions={stackOptions}>
      {isBlocking ? (
        <Stack.Screen name={ROUTES.KILL_SWITCH} component={KillSwitch} />
      ) : (
        <>
          <Stack.Screen name={NAVIGATORS.TABS} component={Tabs} />
          <Stack.Screen name={ROUTES.BREATHING} component={Breathing} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Stacks;

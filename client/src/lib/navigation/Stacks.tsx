import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NAVIGATORS, ROUTES, ScreenProps} from '../../common/constants/routes';
import KillSwitch from '../../routes/KillSwitch/KillSwitch';
import {useRecoilValue} from 'recoil';
import {killSwitchFields} from '../killSwitch/state/state';
import Tabs from './Tabs';
import Breathing from '../../routes/Breathing/Breathing';
import Temple from '../../routes/Temple/Temple';
import ChangingRoom from '../../routes/Temple/ChangingRoom';
import DailyProvider from '../../routes/Temple/DailyProvider';

const Stack = createNativeStackNavigator<ScreenProps>();

const stackOptions = {
  headerShown: false,
};
const TempleStack = () => {
  return (
    <DailyProvider>
      <Stack.Navigator screenOptions={stackOptions}>
        <Stack.Screen name={ROUTES.TEMPLE} component={Temple} />
        <Stack.Screen name={ROUTES.CHANGING_ROOM} component={ChangingRoom} />
      </Stack.Navigator>
    </DailyProvider>
  );
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
          <Stack.Screen name={NAVIGATORS.TEMPLE} component={TempleStack} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Stacks;

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  RootStackProps,
  RootStackRoutes,
  TempleStackProps,
  TempleStackRoutes,
} from '../../common/constants/routes';
import KillSwitch from '../../routes/KillSwitch/KillSwitch';
import {useRecoilValue} from 'recoil';
import {killSwitchFields} from '../killSwitch/state/state';
import Tabs from './Tabs';
import Temple from '../../routes/Temple/Temple';
import ChangingRoom from '../../routes/Temple/ChangingRoom';
import DailyProvider from '../../routes/Temple/DailyProvider';

const TempleStack = createNativeStackNavigator<TempleStackProps>();
const RootStack = createNativeStackNavigator<RootStackProps>();

const stackOptions = {
  headerShown: false,
};
const TempleStackWrapper = () => (
  <DailyProvider>
    <TempleStack.Navigator screenOptions={stackOptions}>
      <TempleStack.Screen
        name={TempleStackRoutes.CHANGING_ROOM}
        component={ChangingRoom}
      />
      <TempleStack.Screen name={TempleStackRoutes.TEMPLE} component={Temple} />
    </TempleStack.Navigator>
  </DailyProvider>
);

const RootStackWrapper = () => {
  const isBlocking = useRecoilValue(killSwitchFields('isBlocking'));

  return (
    <RootStack.Navigator screenOptions={stackOptions}>
      {isBlocking ? (
        <RootStack.Screen
          name={RootStackRoutes.KILL_SWITCH}
          component={KillSwitch}
        />
      ) : (
        <>
          <RootStack.Screen name={RootStackRoutes.TABS} component={Tabs} />
          <RootStack.Screen
            name={RootStackRoutes.TEMPLE_STACK}
            component={TempleStackWrapper}
          />
        </>
      )}
    </RootStack.Navigator>
  );
};

export default RootStackWrapper;

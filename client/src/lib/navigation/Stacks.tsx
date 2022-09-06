import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackProps} from '../../common/constants/routes';
import KillSwitch from '../../routes/KillSwitch/KillSwitch';
import {useRecoilValue} from 'recoil';
import {killSwitchFields} from '../killSwitch/state/state';
import Tabs from './Tabs';

const RootStack = createNativeStackNavigator<RootStackProps>();

const stackOptions = {
  headerShown: false,
};

const RootStackWrapper = () => {
  const isBlocking = useRecoilValue(killSwitchFields('isBlocking'));

  return (
    <RootStack.Navigator screenOptions={stackOptions}>
      {isBlocking ? (
        <RootStack.Screen name={'KillSwitch'} component={KillSwitch} />
      ) : (
        <>
          <RootStack.Screen name={'Tabs'} component={Tabs} />
        </>
      )}
    </RootStack.Navigator>
  );
};

export default RootStackWrapper;

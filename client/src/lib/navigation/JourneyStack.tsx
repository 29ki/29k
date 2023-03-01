import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {JourneyStackProps} from './constants/routes';
import Collection from '../../routes/screens/Collection/Collection';
import Journey from '../../routes/screens/Journey/Journey';

const {Navigator, Screen} = createNativeStackNavigator<JourneyStackProps>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  gestureEnabled: false,
};

const JourneyStack = () => (
  <Navigator screenOptions={screenOptions}>
    <Screen name={'Journey'} component={Journey} />
    <Screen name={'Collection'} component={Collection} />
  </Navigator>
);

export default JourneyStack;

import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {SessionsStackProps} from './constants/routes';
import Sessions from '../../routes/screens/Sessions/Sessions';
import Collection from '../../routes/screens/Collection/Collection';

const {Navigator, Screen} = createNativeStackNavigator<SessionsStackProps>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  gestureEnabled: false,
};

const SessionsStack = () => (
  <Navigator screenOptions={screenOptions}>
    <Screen name={'Sessions'} component={Sessions} />
    <Screen name={'Collection'} component={Collection} />
  </Navigator>
);

export default SessionsStack;

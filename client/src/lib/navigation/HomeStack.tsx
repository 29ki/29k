import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {HomeStackProps} from './constants/routes';
import Home from '../../routes/screens/Home/Home';
import Collection from '../../routes/screens/Collection/Collection';

const {Navigator, Screen} = createNativeStackNavigator<HomeStackProps>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  gestureEnabled: false,
};

const HomeStack = () => (
  <Navigator screenOptions={screenOptions}>
    <Screen name={'Home'} component={Home} />
    <Screen name={'Collection'} component={Collection} />
  </Navigator>
);

export default HomeStack;

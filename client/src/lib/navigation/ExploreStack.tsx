import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {ExploreStackProps} from './constants/routes';
import Explore from '../../routes/screens/Explore/Explore';
import Collection from '../../routes/screens/Collection/Collection';

const {Navigator, Screen} = createNativeStackNavigator<ExploreStackProps>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  gestureEnabled: false,
};

const ExploreStack = () => (
  <Navigator screenOptions={screenOptions}>
    <Screen name={'Explore'} component={Explore} />
    <Screen name={'Collection'} component={Collection} />
  </Navigator>
);

export default ExploreStack;

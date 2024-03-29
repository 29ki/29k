import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {ExploreStackProps} from './constants/routes';
import NewExplore from '../../routes/screens/Explore/Explore';
import Collection from '../../routes/screens/Collection/Collection';
import ExploreTag from '../../routes/screens/Explore/ExploreTag';
import ExploreCategory from '../../routes/screens/Explore/ExploreCategory';

const {Navigator, Screen} = createNativeStackNavigator<ExploreStackProps>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  gestureEnabled: false,
};

const ExploreStack = () => (
  <Navigator screenOptions={screenOptions}>
    <Screen name="Explore" component={NewExplore} />
    <Screen name="ExploreCategory" component={ExploreCategory} />
    <Screen name="ExploreTag" component={ExploreTag} />
    <Screen name="Collection" component={Collection} />
  </Navigator>
);

export default ExploreStack;

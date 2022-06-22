import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from './routes/Home/Home';
import Profile from './routes/Profile/Profile';
import {ROUTES} from './common/constants/routes';

const Tab = createBottomTabNavigator();

const Navigation = () => (
  <NavigationContainer>
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name={ROUTES.HOME} component={Home} />
      <Tab.Screen name={ROUTES.PROFILE} component={Profile} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default Navigation;

import React from 'react';
import CodePush from 'react-native-code-push';
import {CODE_PUSH_DEPLOYMENT_KEY} from 'config';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import './i18n';

import Home from './routes/Home/Home';
import Profile from './routes/Profile/Profile';
import {ROUTES} from './common/constants/routes';

const Tab = createBottomTabNavigator();

const App = () => (
  <NavigationContainer>
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name={ROUTES.HOME} component={Home} />
      <Tab.Screen name={ROUTES.PROFILE} component={Profile} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default CodePush({deploymentKey: CODE_PUSH_DEPLOYMENT_KEY})(App);

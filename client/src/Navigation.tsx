import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from './routes/Home/Home';
import Profile from './routes/Profile/Profile';
import {ROUTES} from './common/constants/routes';
import {HomeIcon, ProfileIcon} from './common/components/Icons';
import {COLORS} from './common/constants/colors';
import {SPACINGS} from './common/constants/spacings';

const Tab = createBottomTabNavigator();

const tabBarOptions = {
  headerShown: false,
  tabBarShowLabel: true,
  tabBarHideOnKeyboard: true,
  tabBarAllowFontScaling: false,
  tabBarActiveTintColor: COLORS.PEACH100,
  tabBarInactiveTintColor: COLORS.GREY600,
  tabBarItemStyle: {
    paddingVertical: SPACINGS.EIGHT,
    height: SPACINGS.SIXTY,
  },
  tabBarStyle: {
    marginBottom: 5,
    elevation: 0,
  },
};

const Navigation = () => (
  <NavigationContainer>
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen
        name={ROUTES.HOME}
        component={Home}
        options={{
          tabBarIcon: () => {
            return <HomeIcon fill={COLORS.GREY600} />;
          },
        }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={Profile}
        options={{
          tabBarIcon: () => {
            return <ProfileIcon fill={COLORS.GREY600} />;
          },
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

export default Navigation;

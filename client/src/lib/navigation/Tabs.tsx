import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeIcon, ProfileIcon} from '../../common/components/Icons';
import {COLORS} from '../../common/constants/colors';
import {ROUTES} from '../../common/constants/routes';
import {SPACINGS} from '../../common/constants/spacings';
import Home from '../../routes/Home/Home';
import Profile from '../../routes/Profile/Profile';

const Tab = createBottomTabNavigator();

const tabBarOptions = {
  backgroundColor: 'red',
  headerShown: false,
  tabBarShowLabel: true,
  tabBarHideOnKeyboard: true,
  tabBarAllowFontScaling: false,
  tabBarActiveTintColor: COLORS.LEAF300,
  tabBarInactiveTintColor: COLORS.GREY800,
  tabBarItemStyle: {
    paddingVertical: SPACINGS.EIGHT,
    height: SPACINGS.SIXTY,
  },
  tabBarStyle: {
    elevation: 0,
    borderTopWidth: 0,
    backgroundColor: COLORS.CREAM500,
  },
};

const Tabs = () => (
  <Tab.Navigator screenOptions={tabBarOptions}>
    <Tab.Screen
      name={ROUTES.HOME}
      component={Home}
      options={{
        tabBarIcon: ({focused}) => (
          <HomeIcon fill={focused ? COLORS.LEAF300 : COLORS.GREY800} />
        ),
      }}
    />
    <Tab.Screen
      name={ROUTES.PROFILE}
      component={Profile}
      options={{
        tabBarIcon: ({focused}) => (
          <ProfileIcon fill={focused ? COLORS.LEAF300 : COLORS.GREY800} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default Tabs;

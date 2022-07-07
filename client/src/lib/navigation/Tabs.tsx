import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeIcon, ProfileIcon} from '../../common/components/Icons';
import {COLORS} from '../../common/constants/colors';
import {ROUTES} from '../../common/constants/routes';
import {SPACINGS} from '../../common/constants/spacings';
import Home from '../../routes/Home/Home';
import Profile from '../../routes/Profile/Profile';
import {B3} from '../../common/components/Typography/Text/Text';
import styled from 'styled-components/native';
import Video from '../../routes/Video/Video';

const Tab = createBottomTabNavigator();

const tabBarOptions = {
  backgroundColor: 'red',
  headerShown: false,
  tabBarShowLabel: true,
  tabBarHideOnKeyboard: true,
  tabBarAllowFontScaling: false,
  tabBarItemStyle: {
    paddingTop: SPACINGS.TWENTY,
  },
  tabBarStyle: {
    elevation: 0,
    height: 100,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderRadius: 24,
    borderColor: COLORS.GREY,
    borderTopColor: undefined,
    backgroundColor: 'transparent',
  },
};

type TabBarLabelProps = {
  readonly focused: boolean;
};
const TabBarLabel = styled(B3)<TabBarLabelProps>(props => ({
  color: props.focused ? COLORS.GREY600 : COLORS.GREY,
}));

const Tabs = () => (
  <Tab.Navigator screenOptions={tabBarOptions}>
    <Tab.Screen
      name={ROUTES.HOME}
      component={Home}
      options={{
        tabBarIcon: ({focused}) => (
          <HomeIcon fill={focused ? COLORS.GREY600 : COLORS.GREY} />
        ),
        tabBarLabel: ({focused}) => (
          <TabBarLabel focused={focused}>home</TabBarLabel>
        ),
      }}
    />
    <Tab.Screen
      name={ROUTES.PROFILE}
      component={Profile}
      options={{
        tabBarIcon: ({focused}) => (
          <ProfileIcon fill={focused ? COLORS.GREY600 : COLORS.GREY} />
        ),
        tabBarLabel: ({focused}) => (
          <TabBarLabel focused={focused}>profile</TabBarLabel>
        ),
      }}
    />
    <Tab.Screen
      name={ROUTES.VIDEO}
      component={Video}
      options={{
        tabBarLabel: ({focused}) => (
          <TabBarLabel focused={focused}>video</TabBarLabel>
        ),
      }}
    />
  </Tab.Navigator>
);

export default Tabs;

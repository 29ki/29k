import React from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';

import {
  HomeFillIcon,
  HomeIcon,
  IconType,
  ProfileFillIcon,
  ProfileIcon,
} from '../../common/components/Icons';
import {COLORS} from '../../common/constants/colors';
import {TabNavigatorProps} from '../../common/constants/routes';
import {SPACINGS} from '../../common/constants/spacings';
import {B3} from '../../common/components/Typography/Text/Text';

import Profile from '../../routes/Profile/Profile';
import Temples from '../../routes/Temples/Temples';

import NS from '../i18n/constants/namespaces';
import {Platform} from 'react-native';

const Tab = createBottomTabNavigator<TabNavigatorProps>();

const tabBarOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarShowLabel: true,
  tabBarHideOnKeyboard: Platform.select({android: true, ios: false}),
  tabBarAllowFontScaling: false,
  tabBarActiveTintColor: COLORS.GREY600,
  tabBarInactiveTintColor: COLORS.GREY,
  tabBarItemStyle: {
    paddingTop: SPACINGS.TWENTY,
  },
  tabBarStyle: {
    elevation: 0,
    height: 100,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
  },
};

const getTabOptions: (
  InactiveIcon: IconType,
  ActiveIcon: IconType,
  label: string,
) => BottomTabNavigationOptions = (InactiveIcon, ActiveIcon, label) => ({
  tabBarIcon: ({focused}) => (focused ? <ActiveIcon /> : <InactiveIcon />),
  tabBarLabel: () => <B3>{label}</B3>,
});

const Tabs = () => {
  const {t} = useTranslation(NS.COMPONENT.TABS);
  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen
        name={'Temples'}
        component={Temples}
        options={getTabOptions(HomeIcon, HomeFillIcon, t('home'))}
      />
      <Tab.Screen
        name={'Profile'}
        component={Profile}
        options={getTabOptions(ProfileIcon, ProfileFillIcon, t('profile'))}
      />
    </Tab.Navigator>
  );
};

export default Tabs;

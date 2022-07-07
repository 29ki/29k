import React from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {HomeIcon, ProfileIcon} from '../../common/components/Icons';
import {COLORS} from '../../common/constants/colors';
import {ROUTES} from '../../common/constants/routes';
import {SPACINGS} from '../../common/constants/spacings';
import Home from '../../routes/Home/Home';
import Profile from '../../routes/Profile/Profile';
import {B3} from '../../common/components/Typography/Text/Text';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import NS from '../i18n/constants/namespaces';

const Tab = createBottomTabNavigator();

type TabBarLabelProps = {
  readonly color: string;
};
const TabBarLabel = styled(B3)<TabBarLabelProps>(({color}) => ({
  color,
}));

const tabBarOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarShowLabel: true,
  tabBarHideOnKeyboard: true,
  tabBarAllowFontScaling: false,
  tabBarActiveTintColor: COLORS.GREY600,
  tabBarInactiveTintColor: COLORS.GREY,
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

const Tabs = () => {
  const {t} = useTranslation(NS.COMPONENT.TABS);

  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen
        name={ROUTES.HOME}
        component={Home}
        options={{
          tabBarIcon: ({color}) => <HomeIcon fill={color} />,
          tabBarLabel: ({color}) => (
            <TabBarLabel color={color}>{t('home')}</TabBarLabel>
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={Profile}
        options={{
          tabBarIcon: ({color}) => <ProfileIcon fill={color} />,
          tabBarLabel: ({color}) => (
            <TabBarLabel color={color}>{t('profile')}</TabBarLabel>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;

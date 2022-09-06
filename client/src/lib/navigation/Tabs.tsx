import React from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';

import {
  FilmCameraIcon,
  IconType,
  ProfileIcon,
} from '../../common/components/Icons';
import {COLORS} from '../../common/constants/colors';
import {
  TabNavigatorProps,
  TempleStackProps,
} from '../../common/constants/routes';
import {SPACINGS} from '../../common/constants/spacings';
import {B3} from '../../common/components/Typography/Text/Text';

import Profile from '../../routes/Profile/Profile';
import Temples from '../../routes/Temples/Temples';

import NS from '../i18n/constants/namespaces';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DailyProvider from '../../routes/Temple/DailyProvider';
import ChangingRoom from '../../routes/Temple/ChangingRoom';
import Temple from '../../routes/Temple/Temple';

const Tab = createBottomTabNavigator<TabNavigatorProps>();

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
    borderTopWidth: 0.5,
    borderTopColor: COLORS.GREY,
    backgroundColor: 'transparent',
  },
};

const getTabOptions: (
  Icon: IconType,
  label: string,
) => BottomTabNavigationOptions = (Icon, label) => ({
  tabBarIcon: ({color}) => <Icon fill={color} />,
  tabBarLabel: ({color}) => <TabBarLabel color={color}>{label}</TabBarLabel>,
});

const TempleStack = createNativeStackNavigator<TempleStackProps>();

const stackOptions = {
  headerShown: false,
};

const TempleStackWrapper = () => (
  <DailyProvider>
    <TempleStack.Navigator screenOptions={stackOptions}>
      <TempleStack.Screen name={'Temples'} component={Temples} />
      <TempleStack.Screen name={'ChangingRoom'} component={ChangingRoom} />
      <TempleStack.Screen name={'Temple'} component={Temple} />
    </TempleStack.Navigator>
  </DailyProvider>
);

const Tabs = () => {
  const {t} = useTranslation(NS.COMPONENT.TABS);
  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen
        name={'ProfileTab'}
        component={Profile}
        options={getTabOptions(ProfileIcon, t('profile'))}
      />
      <Tab.Screen
        name={'TemplesTab'}
        component={TempleStackWrapper}
        options={getTabOptions(FilmCameraIcon, t('video'))}
      />
    </Tab.Navigator>
  );
};

export default Tabs;

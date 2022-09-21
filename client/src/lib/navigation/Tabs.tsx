import React from 'react';
import {
  BottomTabNavigationOptions,
  BottomTabBar,
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';

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
import {BottomSafeArea} from '../../common/components/Spacers/Spacer';

const Tab = createBottomTabNavigator<TabNavigatorProps>();

// This component overrides the way SafeAreaInsets are handled so we have better styling control.
const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
  descriptors,
}) => (
  <>
    <BottomTabBar
      state={state}
      navigation={navigation}
      descriptors={descriptors}
      insets={{top: 0, left: 0, right: 0, bottom: 0}}
    />
    <BottomSafeArea />
  </>
);

const tabBarOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarShowLabel: true,
  tabBarHideOnKeyboard: Platform.select({android: true, ios: false}),
  tabBarAllowFontScaling: false,
  tabBarActiveTintColor: COLORS.GREYDARK,
  tabBarInactiveTintColor: COLORS.BLACK,
  tabBarStyle: {
    height: 46 + SPACINGS.EIGHT * 2,
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: 'transparent',
  },
  tabBarItemStyle: {
    paddingVertical: SPACINGS.EIGHT,
    height: 46 + SPACINGS.EIGHT * 2,
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
    <Tab.Navigator screenOptions={tabBarOptions} tabBar={TabBar}>
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

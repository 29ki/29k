import React from 'react';
import {Platform} from 'react-native';
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
} from '../components/Icons';
import {COLORS} from '../../../../shared/src/constants/colors';
import {TabNavigatorProps} from './constants/routes';
import {SPACINGS} from '../constants/spacings';
import {Body14} from '../components/Typography/Body/Body';
import {BottomSafeArea} from '../components/Spacers/Spacer';

import ProfileStack from './ProfileStack';
import Sessions from '../../routes/Sessions/Sessions';
import Plan from '../../routes/Plan/Plan';

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

const screenOptions: BottomTabNavigationOptions = {
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
  tabBarLabel: () => <Body14>{label}</Body14>,
});

const Tabs = () => {
  const {t} = useTranslation('Component.Tabs');
  return (
    <Tab.Navigator screenOptions={screenOptions} tabBar={TabBar}>
      <Tab.Screen
        name={'Sessions'}
        component={Sessions}
        options={getTabOptions(HomeIcon, HomeFillIcon, t('home'))}
      />
      <Tab.Screen
        name={'Plan'}
        component={Plan}
        options={getTabOptions(ProfileIcon, ProfileFillIcon, t('plan'))}
      />
      <Tab.Screen
        name={'ProfileStack'}
        component={ProfileStack}
        options={getTabOptions(ProfileIcon, ProfileFillIcon, t('profile'))}
      />
    </Tab.Navigator>
  );
};

export default Tabs;

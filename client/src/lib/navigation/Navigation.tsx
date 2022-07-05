import React, {useEffect} from 'react';
import {useRecoilValue} from 'recoil';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import Home from '../../routes/Home/Home';
import Profile from '../../routes/Profile/Profile';
import {ROUTES} from '../../common/constants/routes';
import {HomeIcon, ProfileIcon} from '../../common/components/Icons';
import {COLORS} from '../../common/constants/colors';
import {SPACINGS} from '../../common/constants/spacings';

import {killSwitchFields} from '../killSwitch/state/state';
import useKillSwitch from '../killSwitch/hooks/useKillSwitch';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.GREY100,
  },
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
    backgroundColor: COLORS.GREY100,
  },
};

const Navigation = () => {
  const isBlocking = useRecoilValue(killSwitchFields('isBlocking'));
  const runKillSwitch = useKillSwitch();

  useEffect(() => {
    runKillSwitch();
  }, [runKillSwitch]);

  return (
    <NavigationContainer theme={navTheme}>
      {isBlocking ? (
        <Stack.Navigator>
          <Stack.Screen name={ROUTES.PROFILE} component={Profile} />
        </Stack.Navigator>
      ) : (
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
      )}
    </NavigationContainer>
  );
};

export default Navigation;

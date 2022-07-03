import React, {useEffect} from 'react';
import {useRecoilValue} from 'recoil';
import {NavigationContainer} from '@react-navigation/native';
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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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

const Navigation = () => {
  const isBlocking = useRecoilValue(killSwitchFields('isBlocking'));
  const runKillSwitch = useKillSwitch();

  useEffect(() => {
    runKillSwitch();
  }, [runKillSwitch]);

  return (
    <NavigationContainer>
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
              tabBarIcon: () => <HomeIcon fill={COLORS.GREY600} />,
            }}
          />
          <Tab.Screen
            name={ROUTES.PROFILE}
            component={Profile}
            options={{
              tabBarIcon: () => <ProfileIcon fill={COLORS.GREY600} />,
            }}
          />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;

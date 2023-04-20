import React from 'react';
import {Platform} from 'react-native';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import AboutOverlay from '../../routes/overlays/AboutOverlay/AboutOverlay';
import AboutEditorialOverlay from '../../routes/overlays/AboutEditorialOverlay/AboutEditorialOverlay';
import CommunityEditorialOverlay from '../../routes/overlays/CommunityEditorialOverlay/CommunityEditorialOverlay';
import SETTINGS from '../constants/settings';
import AppStack from './AppStack';
import {OverlayStackProps} from './constants/routes';

const {Navigator, Screen} = createStackNavigator<OverlayStackProps>();

const screenOptions: StackNavigationOptions = {
  headerShown: false,
  presentation: 'modal',
  cardStyle: Platform.select({
    ios: {
      borderTopLeftRadius: SETTINGS.BORDER_RADIUS.CARDS,
      borderTopRightRadius: SETTINGS.BORDER_RADIUS.CARDS,
    },
  }),
};

const OverlayStack = () => (
  <Navigator screenOptions={screenOptions}>
    <Screen name="App" component={AppStack} />
    <Screen name="AboutOverlay" component={AboutOverlay} />
    <Screen name="AboutEditorialOverlay" component={AboutEditorialOverlay} />
    <Screen
      name="CommunityEditorialOverlay"
      component={CommunityEditorialOverlay}
    />
  </Navigator>
);

export default OverlayStack;

import {StackNavigationOptions} from '@react-navigation/stack';
import React from 'react';
import {Platform} from 'react-native';
import {
  createSharedElementStackNavigator,
  SharedElementsComponentConfig,
} from 'react-navigation-shared-element';
import AboutOverlay from '../../routes/AboutOverlay/AboutOverlay';
import EarlyAccessInfoOverlay from '../../routes/Onboarding/Welcome';
import AboutEditorialOverlay from '../../routes/AboutEditorialOverlay/AboutEditorialOverlay';
import CommunityEditorialOverlay from '../../routes/CommunityEditorialOverlay/CommunityEditorialOverlay';
import SETTINGS from '../constants/settings';
import AppStack from './AppStack';
import {OverlayStackProps} from './constants/routes';

const {Navigator, Screen} =
  createSharedElementStackNavigator<OverlayStackProps>();

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

const aboutSharedElements: SharedElementsComponentConfig = () => [
  {id: 'about.image'},
  {
    id: 'about.heading',
    animation: 'fade',
    resize: 'clip',
    align: 'left-top',
  },
  {
    id: 'about.text',
    animation: 'fade',
    resize: 'clip',
    align: 'left-top',
  },
];

const communitySharedElements: SharedElementsComponentConfig = () => [
  {id: 'community.image'},
  {
    id: 'community.heading',
    animation: 'fade',
    resize: 'clip',
    align: 'left-top',
  },
  {
    id: 'community.text',
    animation: 'fade',
    resize: 'clip',
    align: 'left-top',
  },
];

const OverlayStack = () => (
  <Navigator screenOptions={screenOptions} detachInactiveScreens={false}>
    <Screen name="App" component={AppStack} options={{presentation: 'card'}} />
    <Screen name="AboutOverlay" component={AboutOverlay} />
    <Screen
      name="EarlyAccessInfoOverlay"
      component={EarlyAccessInfoOverlay}
      initialParams={{showBack: true}}
    />
    <Screen
      name="AboutEditorialOverlay"
      component={AboutEditorialOverlay}
      sharedElements={aboutSharedElements}
    />
    <Screen
      name="CommunityEditorialOverlay"
      component={CommunityEditorialOverlay}
      sharedElements={communitySharedElements}
    />
  </Navigator>
);

export default OverlayStack;

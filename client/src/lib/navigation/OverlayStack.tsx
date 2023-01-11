import {
  CardStyleInterpolators,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React from 'react';
import {
  createSharedElementStackNavigator,
  SharedElementsComponentConfig,
} from 'react-navigation-shared-element';
import AboutOverlay from '../../routes/AboutOverlay/AboutOverlay';
import CommunityOverlay from '../../routes/CommunityOverlay/CommunityOverlay';
import AppStack from './AppStack';
import {OverlayStackProps} from './constants/routes';

const {Navigator, Screen} =
  createSharedElementStackNavigator<OverlayStackProps>();

const screenOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
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
  <Navigator screenOptions={screenOptions}>
    <Screen name="App" component={AppStack} />
    <Screen
      name="AboutOverlay"
      component={AboutOverlay}
      sharedElements={aboutSharedElements}
    />
    <Screen
      name="CommunityOverlay"
      component={CommunityOverlay}
      sharedElements={communitySharedElements}
    />
  </Navigator>
);

export default OverlayStack;

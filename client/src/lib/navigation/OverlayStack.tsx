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
import AppStack from './AppStack';
import {OverlayStackProps} from './constants/routes';

const {Navigator, Screen} =
  createSharedElementStackNavigator<OverlayStackProps>();

const screenOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
};

const editorialSharedElements: SharedElementsComponentConfig = () => [
  {id: 'editorial.image'},
  {
    id: 'editorial.heading',
    animation: 'fade',
    resize: 'clip',
    align: 'left-top',
  },
  {
    id: 'editorial.text',
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
      sharedElements={editorialSharedElements}
    />
  </Navigator>
);

export default OverlayStack;

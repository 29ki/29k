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
import AppStackWrapper from './AppStack';
import {OverlayStackProps} from './constants/routes';

const OverlayStack = createSharedElementStackNavigator<OverlayStackProps>();

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

const OverlayStackWrapper = () => (
  <OverlayStack.Navigator screenOptions={screenOptions}>
    <OverlayStack.Screen name="App" component={AppStackWrapper} />
    <OverlayStack.Screen
      name="AboutOverlay"
      component={AboutOverlay}
      sharedElements={editorialSharedElements}
    />
  </OverlayStack.Navigator>
);

export default OverlayStackWrapper;

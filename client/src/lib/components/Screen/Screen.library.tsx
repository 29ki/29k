import React from 'react';
import {ScrollView} from 'react-native';
import {Display36} from '../Typography/Display/Display';
import Screen from './Screen';

export const DefaultScreen = () => (
  <Screen>
    <ScrollView>
      <Display36>
        DefaultScreen. Lorem Ipsum is simply dummy text of the printing and
        typesetting industry. Lorem Ipsum has been the industry's standard dummy
        text ever since the 1500s.
      </Display36>
    </ScrollView>
  </Screen>
);
export const DefaultWithBackgroundColor = () => (
  <Screen backgroundColor="red">
    <ScrollView>
      <Display36>
        DefaultWithBackgroundColor. Lorem Ipsum is simply dummy text of the
        printing and typesetting industry. Lorem Ipsum has been the industry's
        standard dummy text ever since the 1500s.
      </Display36>
    </ScrollView>
  </Screen>
);
export const DefaultWithTextColor = () => (
  <Screen textColor="red" onPressBack={() => {}}>
    <ScrollView>
      <Display36>
        DefaultWithTextColor. Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum has been the industry's standard
        dummy text ever since the 1500s.
      </Display36>
    </ScrollView>
  </Screen>
);

export const WithBackAndCloseButton = () => (
  <Screen floatingTopBar={false} onPressBack={() => {}} onPressClose={() => {}}>
    <ScrollView>
      <Display36>
        WithBackButton. Lorem Ipsum is simply dummy text of the printing and
        typesetting industry. Lorem Ipsum has been the industry's standard dummy
        text ever since the 1500s.
      </Display36>
    </ScrollView>
  </Screen>
);
export const WithBackAndCloseButtonFloating = () => (
  <Screen onPressBack={() => {}} onPressClose={() => {}}>
    <ScrollView>
      <Display36>
        WithBackButtonFloating. Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum has been the industry's standard
        dummy text ever since the 1500s.
      </Display36>
    </ScrollView>
  </Screen>
);

export const WithTopBarWithOverlay = () => (
  <Screen topBarOverlay onPressBack={() => {}} backgroundColor="#ff8164">
    <ScrollView>
      <Display36>
        WithTopBarWithOverlay. Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum has been the industry's standard
        dummy text ever since the 1500s.
      </Display36>
    </ScrollView>
  </Screen>
);

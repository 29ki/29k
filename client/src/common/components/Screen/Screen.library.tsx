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
    <Display36>
      WithBackgroundColor. Lorem Ipsum is simply dummy text of the printing and
      typesetting industry. Lorem Ipsum has been the industry's standard dummy
      text ever since the 1500s.
    </Display36>
  </Screen>
);
export const DefaultWithTextColor = () => (
  <Screen textColor="red">
    <Display36>
      WithTextColor. Lorem Ipsum is simply dummy text of the printing and
      typesetting industry. Lorem Ipsum has been the industry's standard dummy
      text ever since the 1500s.
    </Display36>
  </Screen>
);

export const WithBackButton = () => (
  <Screen floatingTopBar={false} onPressBack={() => {}}>
    <Display36>
      WithBackButton. Lorem Ipsum is simply dummy text of the printing and
      typesetting industry. Lorem Ipsum has been the industry's standard dummy
      text ever since the 1500s.
    </Display36>
  </Screen>
);
export const WithBackButtonAndTopBarWithOverlay = () => (
  <Screen topBarOverlay onPressBack={() => {}}>
    <Display36>
      TopBarWithOverlay. Lorem Ipsum is simply dummy text of the printing and
      typesetting industry. Lorem Ipsum has been the industry's standard dummy
      text ever since the 1500s.
    </Display36>
  </Screen>
);
export const WithBackButtonFloating = () => (
  <Screen onPressBack={() => {}}>
    <ScrollView>
      <Display36>
        WithBackButtonFloating. Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum has been the industry's standard
        dummy text ever since the 1500s.
      </Display36>
    </ScrollView>
  </Screen>
);

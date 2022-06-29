import React from 'react';
import {Platform} from 'react-native';
import CodePush from 'react-native-code-push';
import {
  IOS_CODE_PUSH_DEPLOYMENT_KEY,
  ANDROID_CODE_PUSH_DEPLOYMENT_KEY,
} from 'config';

import './i18n';

import Navigation from './Navigation';
import {UiLibProvider} from './hooks/useUiLib';

const App = () => (
  <UiLibProvider>
    <Navigation />
  </UiLibProvider>
);

export default CodePush({
  deploymentKey: Platform.select({
    android: ANDROID_CODE_PUSH_DEPLOYMENT_KEY,
    ios: IOS_CODE_PUSH_DEPLOYMENT_KEY,
  }),
})(App);

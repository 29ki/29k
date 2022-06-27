import React from 'react';
import CodePush from 'react-native-code-push';
import {CLIENT_CODE_PUSH_DEPLOYMENT_KEY} from 'config';

import './i18n';

import Navigation from './Navigation';
import {UiLibProvider} from './hooks/useUiLib';

const App = () => (
  <UiLibProvider>
    <Navigation />
  </UiLibProvider>
);

export default CodePush({deploymentKey: CLIENT_CODE_PUSH_DEPLOYMENT_KEY})(App);

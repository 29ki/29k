import React from 'react';
import CodePush from 'react-native-code-push';
import {CODE_PUSH_DEPLOYMENT_KEY} from 'config';

import './i18n';

import Navigation from './Navigation';

const App = () => <Navigation />;

export default CodePush({deploymentKey: CODE_PUSH_DEPLOYMENT_KEY})(App);

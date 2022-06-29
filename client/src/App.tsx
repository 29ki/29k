import React from 'react';
import './i18n';

import Navigation from './Navigation';
import {UiLibProvider} from './hooks/useUiLib';
import CodePushProvider from './CodePush/CodePushProvider';
import CodePushOverlay from './CodePush/CodePushOverlay';

export default () => (
  <CodePushProvider>
    <UiLibProvider>
      <Navigation />
      <CodePushOverlay />
    </UiLibProvider>
  </CodePushProvider>
);

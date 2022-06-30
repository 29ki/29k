import React from 'react';
import {RecoilRoot} from 'recoil';
import './i18n';

import Navigation from './Navigation';
import {UiLibProvider} from './hooks/useUiLib';
import CodePush from './CodePush/CodePush';
import CodePushOverlay from './CodePush/CodePushOverlay';

export default () => (
  <RecoilRoot>
    <CodePush>
      <UiLibProvider>
        <Navigation />
        <CodePushOverlay />
      </UiLibProvider>
    </CodePush>
  </RecoilRoot>
);

import React from 'react';
import {RecoilRoot} from 'recoil';
import './i18n';

import Navigation from './lib/navigation/Navigation';

import {UiLibProvider} from './lib/uiLib/hooks/useUiLib';
import CodePush from './lib/codePush/CodePush';
import CodePushOverlay from './lib/codePush/CodePushOverlay';

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

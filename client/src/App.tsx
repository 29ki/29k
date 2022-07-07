import React from 'react';
import {RecoilRoot} from 'recoil';

import Navigation from './lib/navigation/Navigation';

import codePush, {CodePushOverlay} from './lib/codePush';
import {UiLibProvider} from './lib/uiLib/hooks/useUiLib';
import Bootsrap from './Bootstrap';

const App = () => (
  <RecoilRoot>
    <UiLibProvider>
      <Bootsrap>
        <Navigation />
        <CodePushOverlay />
      </Bootsrap>
    </UiLibProvider>
  </RecoilRoot>
);

export default codePush(App);

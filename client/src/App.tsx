import React from 'react';
import {RecoilRoot} from 'recoil';

import Navigation from './lib/navigation/Navigation';

import codePush, {CodePushOverlay} from './lib/codePush';
import {UiLibProvider} from './lib/uiLib/hooks/useUiLib';
import Boostrap from './Bootstrap';

const App = () => (
  <RecoilRoot>
    <UiLibProvider>
      <Boostrap>
        <Navigation />
        <CodePushOverlay />
      </Boostrap>
    </UiLibProvider>
  </RecoilRoot>
);

export default codePush(App);

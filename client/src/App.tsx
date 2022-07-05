import React from 'react';
import {RecoilRoot} from 'recoil';
import './lib/i18n/i18n';

import Navigation from './lib/navigation/Navigation';

import codePush, {CodePushOverlay} from './lib/codePush';
import {UiLibProvider} from './lib/uiLib/hooks/useUiLib';
import Boostrap from './Bootstrap';

const App = () => {
  return (
    <RecoilRoot>
      <UiLibProvider>
        <Boostrap>
          <Navigation />
          <CodePushOverlay />
        </Boostrap>
      </UiLibProvider>
    </RecoilRoot>
  );
};

export default codePush(App);

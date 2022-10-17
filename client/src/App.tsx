import React from 'react';
import {RecoilRoot} from 'recoil';

import Navigation from './lib/navigation/Navigation';

import codePush, {CodePushOverlay} from './lib/codePush';
import {UiLibProvider} from './lib/uiLib/hooks/useUiLib';
import Bootstrap from './Bootstrap';
import ErrorBoundary from './lib/sentry/components/ErrorBoundary';

const App = () => (
  <ErrorBoundary>
    <RecoilRoot>
      <UiLibProvider>
        <Bootstrap>
          <Navigation />
          <CodePushOverlay />
        </Bootstrap>
      </UiLibProvider>
    </RecoilRoot>
  </ErrorBoundary>
);

export default codePush(App);

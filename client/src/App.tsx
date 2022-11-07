import React from 'react';

import Navigation from './lib/navigation/Navigation';

import codePush, {CodePushOverlay} from './lib/codePush';
import {UiLibProvider} from './lib/uiLib/hooks/useUiLib';
import Bootstrap from './Bootstrap';
import ErrorBoundary from './lib/sentry/components/ErrorBoundary';

const App = () => (
  <ErrorBoundary>
    <UiLibProvider>
      <Bootstrap>
        <Navigation />
        <CodePushOverlay />
      </Bootstrap>
    </UiLibProvider>
  </ErrorBoundary>
);

export default codePush(App);

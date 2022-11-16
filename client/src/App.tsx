import React from 'react';

import Navigation from './lib/navigation/Navigation';
import Stacks from './lib/navigation/Stacks';

import codePush, {CodePushOverlay} from './lib/codePush';
import {UiLibProvider} from './lib/uiLib/hooks/useUiLib';
import Bootstrap from './Bootstrap';
import ErrorBoundary from './lib/sentry/components/ErrorBoundary';
import {MetricsProvider} from './lib/metrics';

const App = () => (
  <ErrorBoundary>
    <UiLibProvider>
      <Navigation>
        <MetricsProvider>
          <Bootstrap>
            <Stacks />
            <CodePushOverlay />
          </Bootstrap>
        </MetricsProvider>
      </Navigation>
    </UiLibProvider>
  </ErrorBoundary>
);

export default codePush(App);

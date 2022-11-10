import React from 'react';

import Navigation from './lib/navigation/Navigation';

import codePush, {CodePushOverlay} from './lib/codePush';
import {UiLibProvider} from './lib/uiLib/hooks/useUiLib';
import Bootstrap from './Bootstrap';
import ErrorBoundary from './lib/sentry/components/ErrorBoundary';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => (
  <ErrorBoundary>
    <SafeAreaProvider>
      <UiLibProvider>
        <Bootstrap>
          <Navigation />
          <CodePushOverlay />
        </Bootstrap>
      </UiLibProvider>
    </SafeAreaProvider>
  </ErrorBoundary>
);

export default codePush(App);

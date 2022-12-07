import React, {Suspense} from 'react';

import Navigation from './lib/navigation/Navigation';
import ModalStack from './lib/navigation/ModalStack';

import codePush, {CodePushOverlay} from './lib/codePush';
import {UiLibProvider} from './lib/uiLib/hooks/useUiLib';
import Bootstrap from './Bootstrap';
import ErrorBoundary from './lib/sentry/components/ErrorBoundary';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import styled from 'styled-components/native';

const GestureHandler = styled(GestureHandlerRootView)({
  flex: 1,
});
import {MetricsProvider} from './lib/metrics';

const App = () => (
  <ErrorBoundary>
    <SafeAreaProvider>
      <GestureHandler>
        <UiLibProvider>
          <Navigation>
            <MetricsProvider>
              <Bootstrap>
                <Suspense>
                  <ModalStack />
                  <CodePushOverlay />
                </Suspense>
              </Bootstrap>
            </MetricsProvider>
          </Navigation>
        </UiLibProvider>
      </GestureHandler>
    </SafeAreaProvider>
  </ErrorBoundary>
);

export default codePush(App);

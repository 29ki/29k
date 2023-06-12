import React, {Suspense} from 'react';

import Navigation from './lib/navigation/Navigation';
import {MetricsProvider} from './lib/metrics';

import codePush, {CodePushOverlay} from './lib/codePush';
import {UiLibProvider} from './lib/uiLib/hooks/useUiLib';
import Bootstrap from './Bootstrap';
import ErrorBoundary from './lib/sentry/components/ErrorBoundary';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import RootNavigator from './lib/navigation/RootNavigator';
import RehydrateWrapper from './RehydrateWrapper';

const GestureHandler = styled(GestureHandlerRootView)({
  flex: 1,
});

const App = () => (
  <ErrorBoundary>
    <SafeAreaProvider>
      <GestureHandler>
        <UiLibProvider>
          <Navigation>
            <MetricsProvider>
              <Suspense>
                <RehydrateWrapper>
                  <Bootstrap>
                    <RootNavigator />
                    <CodePushOverlay />
                  </Bootstrap>
                </RehydrateWrapper>
              </Suspense>
            </MetricsProvider>
          </Navigation>
        </UiLibProvider>
      </GestureHandler>
    </SafeAreaProvider>
  </ErrorBoundary>
);

export default codePush(App);

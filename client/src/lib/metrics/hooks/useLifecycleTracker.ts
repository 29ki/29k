/*
  This hook is heavily inspired by
  https://github.com/PostHog/posthog-js-lite/blob/master/posthog-react-native/src/hooks/useLifecycleTracker.ts
*/
import {useEffect, useRef} from 'react';
import {AppState} from 'react-native';
import {logEvent} from '../';

const useLifecycleTracker = () => {
  const openTrackedRef = useRef(false);

  useEffect(() => {
    if (!openTrackedRef.current) {
      openTrackedRef.current = true;
      logEvent('Application Opened', undefined);
    }
    const subscription = AppState.addEventListener('change', nextAppState => {
      switch (nextAppState) {
        case 'active':
          return logEvent('Application Became Active', undefined);
        case 'background':
          return logEvent('Application Backgrounded', undefined);
        default:
          return;
      }
    });

    return () => subscription.remove();
  }, []);
};

export default useLifecycleTracker;

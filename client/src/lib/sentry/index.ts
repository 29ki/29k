import * as Sentry from '@sentry/react-native';
import {ENVIRONMENT, GIT_COMMIT_SHORT, SENTRY_DSN} from 'config';

export {default as ErrorBoundary} from './components/ErrorBoundary';

export const init = () => {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    release: GIT_COMMIT_SHORT,
  });
};

export default Sentry;

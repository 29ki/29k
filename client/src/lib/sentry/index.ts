import * as Sentry from '@sentry/react-native';
import {ENVIRONMENT, GIT_COMMIT_SHORT, SENTRY_DSN} from 'config';

export {default as ErrorBoundary} from './components/ErrorBoundary';

export const init = () => {
  Sentry.init({
    dsn: SENTRY_DSN,
    dist: ENVIRONMENT,
    release: GIT_COMMIT_SHORT,
    environment: ENVIRONMENT,
  });
};

export default Sentry;

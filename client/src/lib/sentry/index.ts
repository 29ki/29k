import * as Sentry from '@sentry/react-native';
import {ENVIRONMENT, GIT_COMMIT_SHORT, SENTRY_DSN} from 'config';

export const init = () => {
  Sentry.init({
    dsn: SENTRY_DSN,
    dist: ENVIRONMENT,
    release: GIT_COMMIT_SHORT,
    environment: ENVIRONMENT,
  });
};

export const getCorrelationId = () => {
  const correlationId = Math.random().toString(36).substring(2, 12);
  Sentry.configureScope(scope => {
    scope.setTag('correlation_id', correlationId);
  });
  return correlationId;
};

export default Sentry;

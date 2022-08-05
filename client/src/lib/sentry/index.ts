import * as Sentry from '@sentry/react-native';
import {ENVIRONMENT, SENTRY_DSN} from 'config';

export const init = () => {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
  });
};

export default Sentry;

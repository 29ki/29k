import * as Sentry from '@sentry/node';
import {Context} from 'koa';
import config from '../../lib/config';

const {SENTRY_DSN, GIT_COMMIT_SHORT, ENVIRONMENT} = config;

Sentry.init({
  dsn: SENTRY_DSN,
  dist: ENVIRONMENT,
  release: GIT_COMMIT_SHORT || 'development',
  environment: ENVIRONMENT,
});

const sentryErrorHandler = (err: Error, ctx: Context) => {
  Sentry.withScope(scope => {
    scope.addEventProcessor(event => {
      return Sentry.addRequestDataToEvent(event, ctx.request);
    });
    Sentry.captureException(err);
  });
};

export default sentryErrorHandler;

import * as Sentry from '@sentry/node';
import {RewriteFrames} from '@sentry/integrations';
import {Context} from 'koa';
import config from '../../lib/config';

const {SENTRY_DSN, GIT_COMMIT_SHORT, ENVIRONMENT} = config;

Sentry.init({
  dsn: SENTRY_DSN,
  dist: ENVIRONMENT,
  release: GIT_COMMIT_SHORT || 'development',
  environment: ENVIRONMENT,
  integrations: [
    new RewriteFrames({
      // This is the root in Google Cloud Functions and needs to be stripped from all paths to match source maps
      root: '/workspace',
      prefix: '/functions/',
    }),
  ],
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

import * as Sentry from '@sentry/node';
import {RewriteFrames} from '@sentry/integrations';
import {Context} from 'koa';
import config from './config';

const {SENTRY_DSN, GIT_COMMIT_SHORT, ENVIRONMENT} = config;

Sentry.init({
  dsn: SENTRY_DSN,
  dist: ENVIRONMENT,
  release: GIT_COMMIT_SHORT || 'development',
  environment: ENVIRONMENT,
  maxValueLength: 750,
  integrations: [
    new RewriteFrames({
      // This is the root in Google Cloud Functions and needs to be stripped from all paths to match source maps
      root: '/workspace',
      prefix: '/functions/',
    }),
  ],
});

export const koaSentryErrorReporter = (err: Error, ctx: Context) => {
  const correlationId = ctx.get('X-Correlation-ID');

  Sentry.withScope(scope => {
    scope.setTag('correlation_id', correlationId);

    scope.addEventProcessor(event =>
      Sentry.addRequestDataToEvent(event, ctx.req),
    );
    Sentry.captureException(err);
  });
};

export const cronSentryErrorReporter =
  <argsT, returnT>(monitorSlug: string, fn: (...args: argsT[]) => returnT) =>
  async (...args: argsT[]) => {
    const checkInId = Sentry.captureCheckIn({
      monitorSlug,
      status: 'in_progress',
    });

    try {
      const result = await fn(...args);

      Sentry.captureCheckIn({
        checkInId,
        monitorSlug,
        status: 'ok',
      });

      return result;
    } catch (err) {
      Sentry.captureCheckIn({
        checkInId,
        monitorSlug,
        status: 'error',
      });

      Sentry.withScope(scope => {
        scope.setContext('monitor', {
          slug: monitorSlug,
        });

        Sentry.captureException(err);
      });

      throw err;
    }
  };

import {onRequest} from 'firebase-functions/v2/https';
import Koa from 'koa';

import sentryErrorHandler from '../lib/sentry';
import firebaseBodyParser from '../lib/firebaseBodyParser';
import {createMetricsRouter} from '../lib/routers';
import localErrorHandler from '../lib/localErrorHandler';
import {logEventRouter} from './logEvent';

const app = new Koa();

app.on('error', sentryErrorHandler);
app.on('error', localErrorHandler);

const rootRouter = createMetricsRouter();
rootRouter.use('/logEvent', logEventRouter.routes());

app
  .use(firebaseBodyParser())
  .use(rootRouter.routes())
  .use(rootRouter.allowedMethods());

export const metrics = onRequest(
  {
    region: 'europe-west1',
    memory: '256MiB',
    maxInstances: 1024,
    minInstances: 1,
  },
  app.callback(),
);

import {onRequest} from 'firebase-functions/v2/https';
import Koa from 'koa';
import sentryErrorHandler from '../lib/sentry';
import {createSlackRouter} from '../lib/routers';
import verifySlackRequest from './lib/verifySlackRequest';
import {slackRouter} from './slack';
import localErrorHandler from '../lib/localErrorHandler';

const app = new Koa();

app.on('error', sentryErrorHandler);
app.on('error', localErrorHandler);

const rootRouter = createSlackRouter();
rootRouter.use('/', slackRouter.routes());

app.use(verifySlackRequest()).use(rootRouter.routes());

export const slack = onRequest(
  {
    region: 'europe-west1',
    memory: '256MiB',
    maxInstances: 1024,
    minInstances: 1,
  },
  app.callback(),
);

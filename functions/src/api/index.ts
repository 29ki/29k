import {onRequest} from 'firebase-functions/v2/https';
import Koa from 'koa';

import {killSwitchRouter} from './killswitch';
import {sessionsRouter} from './sessions';
import {userRouter} from './user';
import sentryErrorHandler from './lib/sentry';
import firebaseBodyParser from './lib/firebaseBodyParser';
import languageResolver from './lib/languageResolver';
import firebaseAuth from './lib/firebaseAuth';
import {cerateSlackRouter, createRouter} from '../lib/routers';
import {slackRouter} from './slack';
import verifySlackRequest from './lib/verifySlackRequest';

const app = new Koa();

app.on('error', sentryErrorHandler);

const slackIntegrationRouter = cerateSlackRouter();
slackIntegrationRouter
  .use(verifySlackRequest())
  .use('/slack', slackRouter.routes());

const authoroizedRouter = createRouter();
authoroizedRouter
  .use('/sessions', sessionsRouter.routes())
  .use('/killSwitch', killSwitchRouter.routes())
  .use('/user', userRouter.routes());

app
  .use(firebaseBodyParser())
  .use(slackIntegrationRouter.routes())
  .use(languageResolver())
  .use(firebaseAuth())
  .use(authoroizedRouter.routes())
  .use(authoroizedRouter.allowedMethods());

export const api = onRequest(
  {
    region: 'europe-west1',
    memory: '256MiB',
    maxInstances: 1024,
    minInstances: 1,
  },
  app.callback(),
);

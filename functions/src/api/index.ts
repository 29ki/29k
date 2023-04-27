import {onRequest} from 'firebase-functions/v2/https';
import Koa from 'koa';

import {createApiPreAuthRouter, createApiAuthRouter} from '../lib/routers';
import {killSwitchRouter} from './killswitch';
import {sessionsRouter} from './sessions';
import {userRouter} from './user';
import {postsRouter} from './posts';
import {reportRouter} from './report';
import {onboardingRouter} from './onboarding';
import sentryErrorHandler from '../lib/sentry';
import firebaseBodyParser from '../lib/firebaseBodyParser';
import languageResolver from './lib/languageResolver';
import firebaseAuth from './lib/firebaseAuth';
import localErrorHandler from '../lib/localErrorHandler';
import {assertValidatedResponse} from './lib/validation';

const app = new Koa();

app.on('error', sentryErrorHandler);
app.on('error', localErrorHandler);

const preAuthRouter = createApiPreAuthRouter();
preAuthRouter
  .use('/killSwitch', killSwitchRouter.routes())
  .use('/onboarding', onboardingRouter.routes());

const authRouter = createApiAuthRouter();
authRouter
  .use('/sessions', sessionsRouter.routes())
  .use('/user', userRouter.routes())
  .use('/posts', postsRouter.routes())
  .use('/report', reportRouter.routes());

app
  .use(firebaseBodyParser())
  .use(languageResolver())
  .use(preAuthRouter.routes())
  .use(preAuthRouter.allowedMethods())
  .use(firebaseAuth())
  .use(assertValidatedResponse())
  .use(authRouter.routes())
  .use(authRouter.allowedMethods());

export const api = onRequest(
  {
    region: 'europe-west1',
    memory: '256MiB',
    maxInstances: 1024,
    minInstances: 1,
  },
  app.callback(),
);

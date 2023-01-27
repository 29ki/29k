import {onRequest} from 'firebase-functions/v2/https';
import Koa from 'koa';

import {killSwitchRouter} from './killswitch';
import {sessionsRouter} from './sessions';
import {userRouter} from './user';
import sentryErrorHandler from '../lib/sentry';
import firebaseBodyParser from '../lib/firebaseBodyParser';
import languageResolver from './lib/languageResolver';
import firebaseAuth from './lib/firebaseAuth';
import {createApiRouter} from '../lib/routers';
import localErrorHandler from '../lib/localErrorHandler';

const app = new Koa();

app.on('error', sentryErrorHandler);
app.on('error', localErrorHandler);

const rootRouter = createApiRouter();
rootRouter
  .use('/sessions', sessionsRouter.routes())
  .use('/killSwitch', killSwitchRouter.routes())
  .use('/user', userRouter.routes());

app
  .use(firebaseBodyParser())
  .use(languageResolver())
  .use(firebaseAuth())
  .use(rootRouter.routes())
  .use(rootRouter.allowedMethods());

export const api = onRequest(
  {
    region: 'europe-west1',
    memory: '256MiB',
    maxInstances: 1024,
    minInstances: 1,
  },
  app.callback(),
);

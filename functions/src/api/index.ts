import {onRequest} from 'firebase-functions/v2/https';
import Koa, {DefaultState} from 'koa';
import Router from '@koa/router';

import {killSwitchRouter} from './killswitch';
import {templesRouter} from './temples';
import firebaseBodyParser from './lib/firebaseBodyParser';
import i18nResolver, {I18nContext} from './lib/i18nResolver';
import firebaseAuth, {FirebaseAuthContext} from './lib/firebaseAuth';

const app = new Koa();

const unauthorizedRouter = new Router<DefaultState, I18nContext>();
unauthorizedRouter.use('/killSwitch', killSwitchRouter.routes());

const authoroizedRouter = new Router<
  DefaultState,
  I18nContext & FirebaseAuthContext
>();
authoroizedRouter.use('/temples', templesRouter.routes());

app
  .use(firebaseBodyParser())
  .use(i18nResolver())
  .use(unauthorizedRouter.routes())
  .use(unauthorizedRouter.allowedMethods())
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

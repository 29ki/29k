import {onRequest} from 'firebase-functions/v2/https';
import Koa from 'koa';
import Router from '@koa/router';

import {killSwitchRouter} from './killswitch';
import {templesRouter} from './temples';
import firebaseBodyParser from './lib/firebaseBodyParser';
import i18nResolver from './lib/i18nResolver';
import firebaseAuth from './lib/firebaseAuth';

const app = new Koa();

const apiRouter = new Router();
apiRouter.use('/killSwitch', killSwitchRouter.routes());
apiRouter.use('/temples', templesRouter.routes());

app
  .use(firebaseBodyParser())
  .use(firebaseAuth())
  .use(i18nResolver())
  .use(apiRouter.routes())
  .use(apiRouter.allowedMethods());

export const api = onRequest(
  {
    region: 'europe-west1',
    memory: '256MiB',
    maxInstances: 1024,
    minInstances: 1,
  },
  app.callback(),
);

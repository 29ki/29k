import {onRequest} from 'firebase-functions/v2/https';
import Koa from 'koa';

import {killSwitchRouter} from './killswitch';
import {templesRouter} from './temples';
import firebaseBodyParser from './lib/firebaseBodyParser';
import i18nResolver from './lib/i18nResolver';
import firebaseAuth from './lib/firebaseAuth';
import {createRouter} from '../lib/routers';

const app = new Koa();

const authoroizedRouter = createRouter();
authoroizedRouter
  .use('/temples', templesRouter.routes())
  .use('/killSwitch', killSwitchRouter.routes());

app
  .use(firebaseBodyParser())
  .use(i18nResolver())
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

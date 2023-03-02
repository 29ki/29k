import {createApiRouter} from '../../lib/routers';
import * as sessionsController from '../../controllers/sessions';

const sessionsCountRouter = createApiRouter();

sessionsCountRouter.get('/', async ctx => {
  const completedSessionsCount =
    await sessionsController.getCompletedSessionsCount();

  ctx.set('Cache-Control', 'max-age=1800');
  ctx.status = 200;
  ctx.body = completedSessionsCount;
});

export {sessionsCountRouter};

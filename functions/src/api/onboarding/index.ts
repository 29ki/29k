import {createApiPreAuthRouter} from '../../lib/routers';
import * as sessionsController from '../../controllers/sessions';

const onboardingRouter = createApiPreAuthRouter();

onboardingRouter.get('/sessions', async ctx => {
  const {response} = ctx;

  const sessions = await sessionsController.getUpcomingPublicSessions(3);
  response.status = 200;
  ctx.body = sessions;
});

export {onboardingRouter};

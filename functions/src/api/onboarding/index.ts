import * as yup from 'yup';
import validator from 'koa-yup-validator';
import {createApiPreAuthRouter} from '../../lib/routers';
import * as sessionsController from '../../controllers/sessions';

const onboardingRouter = createApiPreAuthRouter();

const SessionsQuerySchema = yup.object({
  limit: yup.number().positive().integer(),
});

onboardingRouter.get(
  '/sessions',
  validator({query: SessionsQuerySchema}),
  async ctx => {
    const {limit} = ctx.state.validated.query;

    const sessions = await sessionsController.getUpcomingPublicSessions(limit);

    ctx.status = 200;
    ctx.body = sessions;
  },
);

export {onboardingRouter};

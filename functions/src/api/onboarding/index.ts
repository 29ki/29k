import * as yup from 'yup';
import {createApiPreAuthRouter} from '../../lib/routers';
import * as sessionsController from '../../controllers/sessions';
import validation from '../lib/validation';

const onboardingRouter = createApiPreAuthRouter();

const SessionsQuerySchema = yup.object({
  limit: yup.number().positive().integer(),
});

onboardingRouter.get(
  '/sessions',
  validation({query: SessionsQuerySchema}),
  async ctx => {
    const {limit} = ctx.state.query;
    const sessions = await sessionsController.getUpcomingPublicSessions(limit);

    ctx.status = 200;
    ctx.body = sessions;
  },
);

export {onboardingRouter};

import * as yup from 'yup';
import {createApiPreAuthRouter} from '../../lib/routers';
import * as sessionsController from '../../controllers/sessions';
import validation from '../lib/validation';
import {LiveSessionSchema} from '../../../../shared/src/types/Session';

const onboardingRouter = createApiPreAuthRouter();

const SessionsQuerySchema = yup.object({
  limit: yup.number().positive().integer(),
});

onboardingRouter.get(
  '/sessions',
  validation({
    query: SessionsQuerySchema,
    response: yup.array().of(LiveSessionSchema),
  }),
  async ctx => {
    const {limit} = ctx.request.query;
    const sessions = await sessionsController.getUpcomingPublicSessions(limit);

    ctx.status = 200;
    ctx.body = sessions;
  },
);

export {onboardingRouter};

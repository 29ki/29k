import * as yup from 'yup';
import 'firebase-functions';

import {
  CreateSessionType,
  CreateSessionSchema,
  InterestedCountSchema,
  JoinSessionSchema,
  LiveSessionSchema,
  SessionStateSchema,
  SessionStateUpdateSchema,
  SessionType,
  UpdateSessionType,
  UpdateSessionSchema,
} from '../../../../shared/src/schemas/Session';
import {createApiAuthRouter} from '../../lib/routers';
import restrictAccessToRole from '../lib/restrictAccessToRole';

import * as sessionsController from '../../controllers/sessions';
import {
  JoinSessionError,
  ValidateSessionError,
} from '../../../../shared/src/errors/Session';
import {RequestError} from '../../controllers/errors/RequestError';
import {ROLE} from '../../../../shared/src/schemas/User';
import validation from '../lib/validation';

const sessionsRouter = createApiAuthRouter();

const SessionParamsSchema = yup.object({
  id: yup.string().required(),
});

sessionsRouter.get(
  '/',
  validation({response: yup.array().of(LiveSessionSchema)}),
  async ctx => {
    const {response, user, query} = ctx;
    const exerciseId =
      typeof query.exerciseId === 'string' ? query.exerciseId : undefined;
    const hostId = typeof query.hostId === 'string' ? query.hostId : undefined;

    const sessions = await sessionsController.getSessionsByUserId(
      user.id,
      exerciseId,
      hostId,
    );

    response.status = 200;
    ctx.body = sessions;
  },
);

sessionsRouter.get(
  '/:id/sessionToken',
  validation({params: SessionParamsSchema, response: yup.string()}),
  async ctx => {
    const {user, params} = ctx;

    try {
      const token = await sessionsController.getSessionToken(
        user.id,
        params.id,
      );
      ctx.status = 200;
      ctx.body = token;
    } catch (error) {
      const requestError = error as RequestError;
      switch (requestError.code) {
        case ValidateSessionError.notFound:
          ctx.status = 404;
          break;

        case ValidateSessionError.userNotFound:
          ctx.status = 403;
          break;

        default:
          throw error;
      }
      ctx.message = requestError.code;
    }
  },
);

sessionsRouter.get(
  '/:id',
  validation({params: SessionParamsSchema, response: LiveSessionSchema}),
  async ctx => {
    const {user, params} = ctx;

    try {
      const session = await sessionsController.getSession(user.id, params.id);
      ctx.status = 200;
      ctx.body = session;
    } catch (error) {
      const requestError = error as RequestError;
      switch (requestError.code) {
        case ValidateSessionError.notFound:
          ctx.status = 404;
          break;

        case ValidateSessionError.userNotFound:
          ctx.status = 403;
          break;

        default:
          throw error;
      }
      ctx.message = requestError.code;
    }
  },
);

sessionsRouter.post(
  '/',
  restrictAccessToRole<CreateSessionType>(
    ROLE.publicHost,
    ({type}) => type === SessionType.public,
  ),
  validation({body: CreateSessionSchema, response: LiveSessionSchema}),
  async ctx => {
    const {exerciseId, type, startTime, language} = ctx.request.body;
    const {user} = ctx;

    ctx.body = await sessionsController.createSession(user.id, {
      exerciseId,
      type,
      startTime,
      language,
    });
  },
);

sessionsRouter.delete(
  '/:id',
  validation({params: SessionParamsSchema, response: yup.string()}),
  async ctx => {
    const {id} = ctx.params;

    try {
      await sessionsController.removeSession(ctx.user.id, id);
    } catch {
      ctx.status = 500;
    }

    ctx.status = 200;
    ctx.body = 'Session deleted successfully';
  },
);

sessionsRouter.put(
  '/joinSession',
  validation({body: JoinSessionSchema, response: LiveSessionSchema}),
  async ctx => {
    const {inviteCode} = ctx.request.body;
    const {user} = ctx;

    try {
      ctx.body = await sessionsController.joinSession(user.id, inviteCode);
    } catch (error) {
      const requestError = error as RequestError;
      switch (requestError.code) {
        case JoinSessionError.notFound:
          ctx.status = 404;
          break;

        case JoinSessionError.notAvailable:
          ctx.status = 410;
          break;

        default:
          throw error;
      }
      ctx.message = requestError.code;
    }
  },
);

sessionsRouter.put(
  '/:id',
  restrictAccessToRole<UpdateSessionType>(
    ROLE.publicHost,
    ({type}) => type === SessionType.public,
  ),
  validation({
    body: UpdateSessionSchema,
    params: SessionParamsSchema,
    response: LiveSessionSchema,
  }),
  async ctx => {
    const {id} = ctx.params;
    const body = ctx.request.body;

    try {
      const updatedSession = await sessionsController.updateSession(
        ctx.user.id,
        id,
        body,
      );

      ctx.status = 200;
      ctx.body = updatedSession;
    } catch (err) {
      ctx.status = 500;
      throw err;
    }
  },
);

sessionsRouter.put(
  '/:id/interestedCount',
  validation({body: InterestedCountSchema, params: SessionParamsSchema}),
  async ctx => {
    const {id} = ctx.params;
    const {increment} = ctx.request.body;

    try {
      await sessionsController.updateInterestedCount(id, increment);
      ctx.status = 200;
    } catch (err) {
      ctx.status = 500;
      throw err;
    }
  },
);

sessionsRouter.put(
  '/:id/state',
  validation({
    body: SessionStateUpdateSchema,
    params: SessionParamsSchema,
    response: SessionStateSchema,
  }),
  async ctx => {
    const {id} = ctx.params;
    const data = ctx.request.body;

    try {
      const updatedState = await sessionsController.updateSessionState(
        ctx.user.id,
        id,
        data,
      );
      ctx.body = updatedState;
    } catch (err) {
      ctx.status = 500;
      throw err;
    }
  },
);

export {sessionsRouter};

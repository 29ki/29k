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
  RemoveMyselfParamsSchema,
  SessionMode,
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
import {
  getApprovedFeedbackByExercise,
  getFeedbackCountByExercise,
} from '../../controllers/feedback';
import {FeedbackSchema} from '../../../../shared/src/schemas/Feedback';
import {DEFAULT_LANGUAGE_TAG} from '../../lib/i18n';
import {uniq} from 'ramda';

const sessionsRouter = createApiAuthRouter();

const SessionParamsSchema = yup.object({
  id: yup.string().required(),
});

const ExerciseParamsSchema = yup.object({
  exerciseId: yup.string().required(),
});

sessionsRouter.get(
  '/',
  validation({
    query: yup.object({
      exerciseId: yup.string(),
      hostId: yup.string(),
      limit: yup.number().positive().integer(),
    }),
    response: yup.array().of(LiveSessionSchema),
  }),
  async ctx => {
    const {response, user, request, language} = ctx;
    const {exerciseId, hostId, limit} = request.query;

    const languages = uniq([language, DEFAULT_LANGUAGE_TAG]);

    const sessions = await sessionsController.getSessionsByUserId(
      user.id,
      languages,
      exerciseId,
      hostId,
      limit,
    );

    response.status = 200;
    ctx.body = sessions;
  },
);

sessionsRouter.get(
  '/hostingCode/:hostingCode',
  validation({
    params: yup.object({
      hostingCode: yup.number().required(),
    }),
    response: LiveSessionSchema,
  }),
  async ctx => {
    const {hostingCode} = ctx.params;

    try {
      ctx.body = await sessionsController.getSessionByHostingCode(hostingCode);
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

sessionsRouter.get(
  '/exercises/:exerciseId/feedback',
  validation({
    params: ExerciseParamsSchema,
    query: yup.object({
      mode: yup.string().oneOf([SessionMode.async, SessionMode.live]),
      limit: yup.number().positive().integer(),
    }),
    response: yup.array().of(FeedbackSchema),
  }),
  async ctx => {
    const {mode, limit} = ctx.request.query;
    const {exerciseId} = ctx.params;
    const {language} = ctx;

    const languages = uniq([language, DEFAULT_LANGUAGE_TAG]);

    const feedback = await getApprovedFeedbackByExercise(
      exerciseId,
      languages,
      mode,
      limit,
    );
    ctx.set('Cache-Control', 'max-age=1800');
    ctx.body = feedback;
  },
);

sessionsRouter.get(
  '/exercises/:exerciseId/rating',
  validation({
    params: ExerciseParamsSchema,
    query: yup.object({
      mode: yup.string().oneOf([SessionMode.async, SessionMode.live]),
    }),
    response: yup.object({
      positive: yup.number().required(),
      negative: yup.number().required(),
    }),
  }),
  async ctx => {
    const {mode} = ctx.request.query;
    const {exerciseId} = ctx.params;
    const count = await getFeedbackCountByExercise(exerciseId, mode);
    ctx.set('Cache-Control', 'max-age=1800');
    ctx.body = count;
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

        case ValidateSessionError.userNotAuthorized:
          ctx.status = 401;
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
  '/:sessionId/removeMyself',
  validation({params: RemoveMyselfParamsSchema}),
  async ctx => {
    const {user} = ctx;

    try {
      ctx.body = await sessionsController.removeUser(
        ctx.params.sessionId,
        user.id,
      );
      ctx.status = 200;
    } catch (error) {
      const requestError = error as RequestError;
      switch (requestError.code) {
        case ValidateSessionError.notFound:
          ctx.status = 404;
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

sessionsRouter.put(
  '/:id/hostingLink',
  validation({params: SessionParamsSchema, response: yup.string()}),
  async ctx => {
    const {id} = ctx.params;

    try {
      ctx.body = await sessionsController.createSessionHostingLink(
        ctx.user.id,
        id,
      );
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
  '/:id/acceptHostingInvite',
  validation({
    body: yup.object({
      hostingCode: yup.number().required(),
    }),
    params: SessionParamsSchema,
    response: LiveSessionSchema,
  }),
  async ctx => {
    const {id} = ctx.params;
    const {hostingCode} = ctx.request.body;

    try {
      ctx.body = await sessionsController.updateSessionHost(
        ctx.user.id,
        id,
        hostingCode,
      );
    } catch (error) {
      const requestError = error as RequestError;
      switch (requestError.code) {
        case JoinSessionError.notFound:
          ctx.status = 404;
          break;

        case JoinSessionError.notAvailable:
          ctx.status = 410;
          break;

        case ValidateSessionError.userNotAuthorized:
          ctx.status = 401;
          break;

        default:
          throw error;
      }
      ctx.message = requestError.code;
    }
  },
);

export {sessionsRouter};

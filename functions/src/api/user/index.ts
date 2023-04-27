import * as yup from 'yup';

import {createApiAuthRouter} from '../../lib/routers';
import {UserError, VerificationError} from '../../../../shared/src/errors/User';
import {
  requestPublicHostRole,
  verifyPublicHostRequest,
} from '../../controllers/publicHostRequests';
import {RequestError} from '../../controllers/errors/RequestError';
import {
  getMe,
  getPublicHosts,
  getUser,
  updateUser,
} from '../../controllers/user';
import {UserDataSchema, UserSchema} from '../../../../shared/src/types/User';
import validation from '../lib/validation';

const userRouter = createApiAuthRouter();

userRouter.post('/requestPublicHost', async ctx => {
  const {id} = ctx.user;

  try {
    await requestPublicHostRole(id);
    ctx.response.status = 200;
  } catch (error) {
    const requestError = error as RequestError;
    switch (requestError.code) {
      case VerificationError.userNeedEmail:
        ctx.status = 401;
        break;

      case VerificationError.requestExists:
        ctx.status = 409;
        break;

      default:
        throw error;
    }

    ctx.message = requestError.code;
  }
});

const PromoteUserSchema = yup.object().shape({
  verificationCode: yup.number().required(),
});

type PromoteUser = yup.InferType<typeof PromoteUserSchema>;

userRouter.put(
  '/verifyPublicHostCode',
  validation({body: PromoteUserSchema}),
  async ctx => {
    const {verificationCode} = ctx.request.body as PromoteUser;
    const {id} = ctx.user;

    try {
      await verifyPublicHostRequest(id, verificationCode);
      ctx.response.status = 200;
    } catch (error) {
      const requestError = error as RequestError;
      switch (requestError.code) {
        case VerificationError.requestNotFound:
          ctx.status = 404;
          break;

        case VerificationError.requestDeclined:
          ctx.status = 410;
          break;
        case VerificationError.verificationAlreadyCalimed:
          ctx.status = 410;
          break;

        case VerificationError.verificationFailed:
          ctx.status = 404;
          break;

        default:
          throw error;
      }

      ctx.message = requestError.code;
    }
  },
);

userRouter.get(
  '/publicHosts',
  validation({response: yup.array().of(UserSchema)}),
  async ctx => {
    const publicHosts = await getPublicHosts();
    ctx.body = publicHosts;
  },
);

userRouter.get('/', validation({response: UserDataSchema}), async ctx => {
  const {id} = ctx.user;
  const me = await getMe(id);
  ctx.body = me;
});

userRouter.get('/:id', validation({response: UserSchema}), async ctx => {
  try {
    const user = await getUser(ctx.params.id);
    ctx.set('Cache-Control', 'max-age=1800');
    ctx.body = user;
  } catch (error) {
    const requestError = error as RequestError;
    switch (requestError.code) {
      case UserError.userNotFound:
        ctx.status = 404;
        break;
      default:
        throw error;
    }
    ctx.message = requestError.code;
  }
});

const UpdateUserSchema = yup.object().shape({
  description: yup.string(),
});

userRouter.post('/', validation({body: UpdateUserSchema}), async ctx => {
  try {
    const {id} = ctx.user;
    await updateUser(id, ctx.request.body);
    ctx.status = 200;
  } catch (error) {
    ctx.status = 500;
  }
});

export {userRouter};

import * as yup from 'yup';
import validator from 'koa-yup-validator';

import {createApiAuthRouter} from '../../lib/routers';
import {
  UserProfileError,
  VerificationError,
} from '../../../../shared/src/errors/User';
import {
  requestPublicHostRole,
  verifyPublicHostRequest,
} from '../../controllers/publicHostRequests';
import {RequestError} from '../../controllers/errors/RequestError';
import {getProfile} from '../../controllers/user';

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
  validator({body: PromoteUserSchema}),
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

userRouter.get('/:id', async ctx => {
  try {
    const userProfile = await getProfile(ctx.params.id);
    ctx.set('Cache-Control', 'max-age=1800');
    ctx.body = userProfile;
  } catch (error) {
    const requestError = error as RequestError;
    switch (requestError.code) {
      case UserProfileError.userNotFound:
        ctx.status = 404;
        break;
      default:
        throw error;
    }
    ctx.message = requestError.code;
  }
});

export {userRouter};

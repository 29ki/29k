import * as yup from 'yup';
import validator from 'koa-yup-validator';
import {createRouter} from '../../lib/routers';

import {
  requestPublicHostRole,
  verifyPublicHostRequest,
} from '../../controllers/publicHostRequests';
import {RequestError} from '../../controllers/errors/RequestError';

const userRouter = createRouter();

userRouter.post('/requestPublicHost', async ctx => {
  const {id} = ctx.user;

  try {
    await requestPublicHostRole(id);
    ctx.response.status = 200;
  } catch (error) {
    const requestError = error as RequestError;
    switch (requestError.code) {
      case 'user-needs-email':
        ctx.status = 401;
        ctx.message =
          'User needs to be registerd with email to request public host role';
        break;

      case 'request-exists':
        ctx.status = 409;
        ctx.message = 'User have already made a request';
        break;

      default:
        throw error;
    }
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
        case 'request-not-found':
          ctx.status = 404;
          ctx.message = 'No request found for user';
          break;

        case 'request-expired':
          ctx.status = 410;
          ctx.message = 'Request has expired';
          break;

        case 'verification-failed':
          ctx.status = 404;
          ctx.message = 'Verification code not matching';
          break;

        default:
          break;
      }
    }
  },
);

export {userRouter};

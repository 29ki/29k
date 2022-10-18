import {Timestamp} from 'firebase-admin/firestore';
import dayjs from 'dayjs';
import * as yup from 'yup';
import validator from 'koa-yup-validator';
import {getAuth} from 'firebase-admin/auth';
import {createRouter} from '../../lib/routers';
import {ROLES} from '../../../../shared/src/types/User';
import {generateVerificationCode} from '../../lib/utils';
import {
  addRequest,
  getRequstByUserId,
  removeUsersRequest,
} from '../../models/requests';

const userRouter = createRouter();

userRouter.post('/requestPublicHost', async ctx => {
  const {id} = ctx.user;

  const user = await getAuth().getUser(id);

  if (!user.email) {
    ctx.status = 401;
    ctx.message =
      'User needs to be registerd with email to request public host role';
    return;
  }

  const request = await getRequstByUserId(id);

  if (request) {
    ctx.status = 409;
    ctx.message = 'User have already made a request';
    return;
  }

  await addRequest(id, generateVerificationCode());

  ctx.response.status = 200;
});

const PromoteUserSchema = yup.object().shape({
  verificationCode: yup.number().required(),
});

type PromoteUser = yup.InferType<typeof PromoteUserSchema>;

userRouter.put('/verify', validator({body: PromoteUserSchema}), async ctx => {
  const {verificationCode} = ctx.request.body as PromoteUser;
  const {id} = ctx.user;

  const request = await getRequstByUserId(id);

  if (!request) {
    ctx.status = 404;
    ctx.message = 'No request found for user';
    return;
  }

  if (
    dayjs(request.expires.toDate()).isBefore(dayjs(Timestamp.now().toDate()))
  ) {
    ctx.status = 410;
    ctx.message = 'Request has expired';
    return;
  }

  if (request.verificationCode !== verificationCode) {
    ctx.status = 404;
    ctx.message = 'Verification code not matching';
    return;
  }

  await getAuth().setCustomUserClaims(id, {role: ROLES.publicHost});
  await removeUsersRequest(id);

  ctx.response.status = 200;
});

export {userRouter};

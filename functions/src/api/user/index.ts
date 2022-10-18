import * as yup from 'yup';
import validator from 'koa-yup-validator';
import {getAuth} from 'firebase-admin/auth';
import {createRouter} from '../../lib/routers';
import {ROLES} from '../../../../shared/src/types/User';

const userRouter = createRouter();

const PromoteUserSchema = yup.object().shape({
  verificationCode: yup.number().required(),
});

type PromoteUser = yup.InferType<typeof PromoteUserSchema>;

userRouter.put('/promote', validator({body: PromoteUserSchema}), async ctx => {
  // TODO: Verify verification code
  const {verificationCode} = ctx.request.body as PromoteUser;
  const {id} = ctx.user;

  await getAuth().setCustomUserClaims(id, {role: ROLES.publicHost});

  ctx.response.status = 200;
});

export {userRouter};

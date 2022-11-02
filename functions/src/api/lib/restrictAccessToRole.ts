import {Next} from 'koa';
import {ROLES} from '../../../../shared/src/types/User';
import {FirebaseAuthContext} from './firebaseAuth';

const restrictAccessToRole =
  <T>(
    role: keyof typeof ROLES,
    inputNeedsRole: (body: T) => boolean = () => true,
  ) =>
  async (ctx: FirebaseAuthContext, next: Next) => {
    const {customClaims} = ctx.user;

    if (customClaims?.role !== role && inputNeedsRole(ctx.request?.body as T)) {
      ctx.status = 401;
      return;
    }

    await next();
  };

export default restrictAccessToRole;

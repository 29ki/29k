import {Next} from 'koa';
import {getAuth} from 'firebase-admin/auth';
import {ROLES} from '../../../../shared/src/types/User';
import {FirebaseAuthContext} from './firebaseAuth';

const restrictAccessToRole =
  (role: keyof typeof ROLES) =>
  async (ctx: FirebaseAuthContext, next: Next) => {
    const customClaims = (await getAuth().getUser(ctx.user.id)).customClaims;
    if (customClaims?.role !== role) {
      ctx.status = 401;
      return;
    }

    next();
  };

export default restrictAccessToRole;

import {getAuth} from 'firebase-admin/auth';
import {Context, Next} from 'koa';

const firebaseAuth = () => async (ctx: Context, next: Next) => {
  const {headers} = ctx;

  if (headers?.authorization) {
    // deny unsupported token format or empty token
    const [type, token] = headers.authorization.split(' ', 2);
    if ((type != 'Bearer' && type != 'bearer') || !token) {
      throw new Error('Invalid authorization');
    }

    const user = await getAuth().verifyIdToken(token);

    ctx.user = {
      id: user.sub,
    };
  }

  await next();
};

export default firebaseAuth;

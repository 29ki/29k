import {FirebaseError} from 'firebase-admin';
import {getAuth} from 'firebase-admin/auth';
import {Context, Next} from 'koa';

export type FirebaseAuthContext = Context & {
  user: {id: string; customClaims?: {[key: string]: string}};
};

const firebaseAuth = () => async (ctx: FirebaseAuthContext, next: Next) => {
  const {headers} = ctx;

  if (!headers?.authorization) {
    throw new Error('Non authorized request');
  }

  // deny unsupported token format or empty token
  const [type, token] = headers.authorization.split(' ', 2);
  if ((type != 'Bearer' && type != 'bearer') || !token) {
    throw new Error('Invalid authorization');
  }

  try {
    const user = await getAuth().verifyIdToken(token);
    const customClaims = (await getAuth().getUser(user.sub)).customClaims;

    ctx.user = {
      id: user.sub,
      customClaims,
    };
  } catch (error) {
    const firebaseError = error as FirebaseError;
    switch (firebaseError.code) {
      case 'auth/user-not-found': {
        ctx.status = 401;
        return;
      }
      case 'auth/id-token-expired':
      case 'auth/id-token-revoked':
      case 'auth/argument-error': {
        ctx.status = 400;
        return;
      }

      default: {
        throw error;
      }
    }
  }

  await next();
};

export default firebaseAuth;

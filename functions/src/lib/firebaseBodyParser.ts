import {Request as FirebaseRequest} from 'firebase-functions';
import {Context as KoaContext, Next} from 'koa';

/*
Firebase parses body for us, so no need for a body parser
https://github.com/koajs/bodyparser/issues/127
*/
export type FirebaseContext = Omit<KoaContext, 'req'> & {
  req: FirebaseRequest;
};

const firebaseBodyParser = () => async (ctx: FirebaseContext, next: Next) => {
  ctx.request.body = ctx.req.body;
  await next();
};

export default firebaseBodyParser;

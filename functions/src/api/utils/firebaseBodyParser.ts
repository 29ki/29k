import {Request} from 'firebase-functions';
import {ExtendableContext, Next, Request as KoaRequest} from 'koa';

/*
Firebase parses body for us, so no need for a body parser
https://github.com/koajs/bodyparser/issues/127
*/
export type FirebaseContext = ExtendableContext & {
  req: Request;
  request: KoaRequest & {
    body?: unknown;
  };
};

const firebaseBodyParser = () => async (ctx: FirebaseContext, next: Next) => {
  ctx.request.body = ctx.req.body;
  await next();
};

export default firebaseBodyParser;

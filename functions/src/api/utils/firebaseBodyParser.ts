import {Request} from 'firebase-functions';
import {ExtendableContext, Next} from 'koa';

/*
Firebase parses body for us, so no need for a body parser
https://github.com/koajs/bodyparser/issues/127
*/
export type FirebaseContext = ExtendableContext & {
  req: Request;
};

const firebaseBodyParser = () => async (ctx: FirebaseContext, next: Next) => {
  ctx.request.body = ctx.req.body;
  await next();
};

export default firebaseBodyParser;

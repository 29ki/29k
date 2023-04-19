import {Context, Next} from 'koa';
import {pick} from 'ramda';

const responseFilter =
  <T>() =>
  <U extends T[]>(array: U & ([T] extends [U[number]] ? unknown : 'Invalid')) =>
  async (ctx: Context, next: Next) => {
    await next();
    if (ctx.status === 200) {
      if (Array.isArray(ctx.body)) {
        ctx.body = ctx.body.map(b => pick(array as Array<keyof T>, b));
      } else {
        ctx.body = pick(array as Array<keyof T>, ctx.body);
      }
    }
  };

export default responseFilter;

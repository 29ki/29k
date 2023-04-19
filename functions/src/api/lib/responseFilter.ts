import {Context, Next} from 'koa';
import {pick} from 'ramda';

const responseFilter =
  <T>(props: Array<keyof T>) =>
  async (ctx: Context, next: Next) => {
    await next();
    if (ctx.status === 200) {
      if (Array.isArray(ctx.body)) {
        ctx.body = ctx.body.map(b => pick(props, b));
      } else {
        ctx.body = pick(props, ctx.body);
      }
    }
  };

export default responseFilter;

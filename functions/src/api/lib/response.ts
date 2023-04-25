import {Context, Next} from 'koa';
import * as yup from 'yup';

type Validator = yup.Schema<unknown>['validateSync'];

interface ResponseContext extends Context {
  validate?: Validator;
}

export const response = () => async (ctx: ResponseContext, next: Next) => {
  await next();
  if (ctx.status === 200 && ctx.body) {
    if (!ctx.state?.validated?.response) {
      throw new Error(
        `No schema found for the response to ${ctx.request.method} at ${ctx.request.URL}`,
      );
    }
  }
};

export const responseFilter =
  (schema?: {validateSync?: Validator}) =>
  async (ctx: ResponseContext, next: Next) => {
    if (schema?.validateSync) {
      ctx.validate = schema.validateSync.bind(schema);
    }

    await next();
  };

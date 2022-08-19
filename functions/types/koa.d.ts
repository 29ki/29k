// eslint-disable-next-line
import * as Koa from 'koa';
declare module 'koa' {
  interface Request {
    body: any; // eslint-disable-line
  }
}

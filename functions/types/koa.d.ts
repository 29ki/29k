/*
Since wre use our own body parser (firebaseBodyParser), we extend the koa request type with body.

Inspired by the koa-bodyparser types
https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/koa-bodyparser/index.d.ts#L1
*/
// eslint-disable-next-line
import * as Koa from 'koa';
declare module 'koa' {
  interface Request {
    body: any; // eslint-disable-line
  }
}

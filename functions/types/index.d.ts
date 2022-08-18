declare module 'koa' {
  interface Request {
    body?: any;
    rawBody: string;
  }
}

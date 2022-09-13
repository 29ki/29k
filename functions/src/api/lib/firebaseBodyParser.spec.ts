import {Request} from 'firebase-functions/v1';
import firebaseBodyParser, {FirebaseContext} from './firebaseBodyParser';

describe('firebaseBodyParser', () => {
  it('adds the already parsed firebase body to the koa request object', async () => {
    const middleware = firebaseBodyParser();

    const ctx = {
      request: {
        body: '{"foo":"bar"}',
      },
      req: {
        body: {foo: 'bar'},
      } as Request,
    };
    const next = jest.fn();

    await middleware(ctx as FirebaseContext, next);

    expect(ctx).toEqual({
      request: {
        body: {foo: 'bar'},
      },
      req: {
        body: {foo: 'bar'},
      },
    });

    expect(next).toBeCalledTimes(1);
  });
});

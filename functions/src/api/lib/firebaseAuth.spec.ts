import {getAuth} from 'firebase-admin/auth';
import firebaseAuth, {FirebaseAuthContext} from './firebaseAuth';

afterEach(() => {
  jest.clearAllMocks();
});

describe('firebaseAuth', () => {
  it('resolves the user requesting and adds it to the context', async () => {
    (getAuth().verifyIdToken as jest.Mock).mockReturnValueOnce({
      sub: 'some-user-id',
    });

    const middleware = firebaseAuth();

    const ctx = {
      headers: {
        authorization: 'bearer some-token',
      },
    } as FirebaseAuthContext;
    const next = jest.fn();

    await middleware(ctx, next);

    expect(getAuth().verifyIdToken).toHaveBeenCalledTimes(1);
    expect(getAuth().verifyIdToken).toHaveBeenCalledWith('some-token');

    expect(ctx).toEqual({
      headers: {
        authorization: 'bearer some-token',
      },
      user: {
        id: 'some-user-id',
      },
    });

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('throws on requests without authorization', async () => {
    const middleware = firebaseAuth();

    const ctx = {
      headers: {},
    } as FirebaseAuthContext;

    const next = jest.fn();

    await expect(middleware(ctx, next)).rejects.toThrow(
      new Error('Non authorized request'),
    );

    expect(getAuth().verifyIdToken).toHaveBeenCalledTimes(0);

    expect(ctx).toEqual({
      headers: {},
    });

    expect(next).toHaveBeenCalledTimes(0);
  });

  it('throws on malformed authorization header', async () => {
    (getAuth().verifyIdToken as jest.Mock).mockRejectedValueOnce(
      new Error('Failed verification'),
    );

    const middleware = firebaseAuth();

    const ctx = {
      headers: {
        authorization: 'malformed-authorization',
      },
    } as FirebaseAuthContext;

    const next = jest.fn();

    await expect(middleware(ctx, next)).rejects.toThrow(
      new Error('Invalid authorization'),
    );
    expect(next).toHaveBeenCalledTimes(0);
  });

  it('throws when token verification fails', async () => {
    (getAuth().verifyIdToken as jest.Mock).mockRejectedValueOnce(
      new Error('Failed verification'),
    );

    const middleware = firebaseAuth();

    const ctx = {
      headers: {
        authorization: 'bearer some-token',
      },
    } as FirebaseAuthContext;

    const next = jest.fn();

    await expect(middleware(ctx, next)).rejects.toThrow(
      new Error('Failed verification'),
    );
    expect(next).toHaveBeenCalledTimes(0);
  });
});

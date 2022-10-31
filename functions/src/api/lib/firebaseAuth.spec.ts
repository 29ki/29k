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
    (getAuth().getUser as jest.Mock).mockReturnValueOnce({
      customClaims: {role: 'some-role'},
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
    expect(getAuth().getUser).toHaveBeenCalledTimes(1);
    expect(getAuth().getUser).toHaveBeenCalledWith('some-user-id');

    expect(ctx).toEqual({
      headers: {
        authorization: 'bearer some-token',
      },
      user: {
        id: 'some-user-id',
        customClaims: {role: 'some-role'},
      },
    });

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('returns 401 when user not found', async () => {
    (getAuth().verifyIdToken as jest.Mock).mockRejectedValueOnce({
      code: 'auth/user-not-found',
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

    expect(ctx).toEqual({
      status: 401,
      headers: {
        authorization: 'bearer some-token',
      },
    });

    expect(next).toHaveBeenCalledTimes(0);
  });

  it('returns 403 when token expired', async () => {
    (getAuth().verifyIdToken as jest.Mock).mockRejectedValueOnce({
      code: 'auth/id-token-expired',
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

    expect(ctx).toEqual({
      status: 403,
      headers: {
        authorization: 'bearer some-token',
      },
    });

    expect(next).toHaveBeenCalledTimes(0);
  });

  it('returns 403 when token revoked', async () => {
    (getAuth().verifyIdToken as jest.Mock).mockRejectedValueOnce({
      code: 'auth/id-token-revoked',
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

    expect(ctx).toEqual({
      status: 403,
      headers: {
        authorization: 'bearer some-token',
      },
    });

    expect(next).toHaveBeenCalledTimes(0);
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

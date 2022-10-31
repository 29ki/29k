import {getAuth} from 'firebase-admin/auth';
import {ROLES} from '../../../../shared/src/types/User';
import {FirebaseAuthContext} from './firebaseAuth';
import restrictAccessToRole from './restrictAccessToRole';

afterEach(() => {
  jest.clearAllMocks();
});

describe('restrictAccessToRole', () => {
  it('allows access if user have right access role', async () => {
    const middleware = restrictAccessToRole('publicHost');

    const ctx = {
      user: {
        id: 'some-user-id',
        customClaims: {role: ROLES.publicHost},
      },
    } as unknown as FirebaseAuthContext;
    const next = jest.fn();

    await middleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('allows access if user have right access role and input needs it', async () => {
    const middleware = restrictAccessToRole<{type: string}>(
      'publicHost',
      ({type}) => type === 'public',
    );

    const ctx = {
      user: {
        id: 'some-user-id',
        customClaims: {role: ROLES.publicHost},
      },
      request: {
        body: {type: 'public'},
      },
    } as unknown as FirebaseAuthContext;
    const next = jest.fn();

    await middleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('allows access if input does not need access role', async () => {
    const middleware = restrictAccessToRole<{type: string}>(
      'publicHost',
      ({type}) => type === 'public',
    );

    const ctx = {
      user: {
        id: 'some-user-id',
      },
      request: {
        body: {type: 'private'},
      },
    } as unknown as FirebaseAuthContext;
    const next = jest.fn();

    await middleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('allows access if user does not have access role but input does not need it', async () => {
    (getAuth().getUser as jest.Mock).mockReturnValueOnce({
      customClaims: {role: 'some-other-role'},
    });

    const middleware = restrictAccessToRole<{type: string}>(
      'publicHost',
      ({type}) => type === 'public',
    );

    const ctx = {
      user: {
        id: 'some-user-id',
        customClaims: {role: 'some-other-role'},
      },
      request: {
        body: {type: 'private'},
      },
    } as unknown as FirebaseAuthContext;
    const next = jest.fn();

    await middleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('returns 401 when user does not have access role', async () => {
    (getAuth().getUser as jest.Mock).mockReturnValueOnce({
      customClaims: {role: 'some-other-role'},
    });

    const middleware = restrictAccessToRole('publicHost');

    const ctx = {
      user: {
        id: 'some-user-id',
        customClaims: {role: 'some-other-role'},
      },
    } as unknown as FirebaseAuthContext;
    const next = jest.fn();

    await middleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(0);
    expect(ctx).toEqual({
      status: 401,
      user: {
        id: 'some-user-id',
        customClaims: {role: 'some-other-role'},
      },
    });
  });

  it('returns 401 when user does not have any claims', async () => {
    (getAuth().getUser as jest.Mock).mockReturnValueOnce({
      customClaims: undefined,
    });

    const middleware = restrictAccessToRole('publicHost');

    const ctx = {
      user: {
        id: 'some-user-id',
      },
    } as FirebaseAuthContext;
    const next = jest.fn();

    await middleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(0);
    expect(ctx).toEqual({
      status: 401,
      user: {
        id: 'some-user-id',
      },
    });
  });

  it('allows access when user does not have any claims but input does not need it', async () => {
    (getAuth().getUser as jest.Mock).mockReturnValueOnce({
      customClaims: undefined,
    });

    const middleware = restrictAccessToRole<{type: string}>(
      'publicHost',
      ({type}) => type === 'public',
    );

    const ctx = {
      user: {
        id: 'some-user-id',
      },
      request: {
        body: {type: 'private'},
      },
    } as unknown as FirebaseAuthContext;
    const next = jest.fn();

    await middleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});

import {getAuth} from 'firebase-admin/auth';
import {ROLES} from '../../../../shared/src/types/User';
import {FirebaseAuthContext} from './firebaseAuth';
import restrictAccessToRole from './restrictAccessToRole';

afterEach(() => {
  jest.clearAllMocks();
});

describe('restrictAccessToRole', () => {
  it('allows access if user have right access role', async () => {
    (getAuth().getUser as jest.Mock).mockReturnValueOnce({
      customClaims: {role: ROLES.publicHost},
    });

    const middleware = restrictAccessToRole('publicHost');

    const ctx = {
      user: {
        id: 'some-user-id',
      },
    } as FirebaseAuthContext;
    const next = jest.fn();

    await middleware(ctx, next);

    expect(getAuth().getUser).toHaveBeenCalledTimes(1);
    expect(getAuth().getUser).toHaveBeenCalledWith('some-user-id');

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
      },
    } as FirebaseAuthContext;
    const next = jest.fn();

    await middleware(ctx, next);

    expect(getAuth().getUser).toHaveBeenCalledTimes(1);
    expect(getAuth().getUser).toHaveBeenCalledWith('some-user-id');

    expect(next).toHaveBeenCalledTimes(0);
    expect(ctx).toEqual({
      status: 401,
      user: {
        id: 'some-user-id',
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

    expect(getAuth().getUser).toHaveBeenCalledTimes(1);
    expect(getAuth().getUser).toHaveBeenCalledWith('some-user-id');

    expect(next).toHaveBeenCalledTimes(0);
    expect(ctx).toEqual({
      status: 401,
      user: {
        id: 'some-user-id',
      },
    });
  });
});

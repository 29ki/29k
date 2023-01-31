import auth from '@react-native-firebase/auth';
import {
  createUser,
  ensureUserCreated,
  getAuthorizationToken,
  recreateUser,
} from '.';

afterEach(() => {
  jest.clearAllMocks();
});

describe('createUser', () => {
  it('signs in anonymously', async () => {
    await createUser();

    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);
  });

  it('does not run user creation in parallel', async () => {
    await Promise.all([createUser(), createUser(), createUser()]);

    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);
  });
});

describe('recreateUser', () => {
  it('signs out and signs in if currentUser is set', async () => {
    await recreateUser();

    expect(auth().signOut).toHaveBeenCalledTimes(1);
    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);
  });

  it('only signs out if currentUser is set', async () => {
    jest.mocked(auth).mockReturnValueOnce({currentUser: null} as any);

    await recreateUser();

    expect(auth().signOut).toHaveBeenCalledTimes(0);
    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);
  });

  it('does not run user recreation in parallel', async () => {
    await Promise.all([recreateUser(), recreateUser(), recreateUser()]);

    expect(auth().signOut).toHaveBeenCalledTimes(1);
    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);
  });
});

describe('ensureUserCreated', () => {
  it('creates user if currentUser is not set', async () => {
    jest.mocked(auth).mockReturnValueOnce({currentUser: null} as any);

    await ensureUserCreated();

    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);
  });

  it('does not create user if currentUser set', async () => {
    await ensureUserCreated();

    expect(auth().signInAnonymously).toHaveBeenCalledTimes(0);
  });
});

describe('getAuthorizationToken', () => {
  it('returns an id token', async () => {
    jest
      .mocked(auth().currentUser?.getIdToken)
      ?.mockResolvedValueOnce('some-authorization-token');

    expect(await getAuthorizationToken()).toBe('some-authorization-token');
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledTimes(1);
  });

  it('creates user if no currentUser', async () => {
    jest
      .mocked(auth().currentUser?.getIdToken)
      ?.mockResolvedValueOnce('some-authorization-token');

    jest.mocked(auth).mockReturnValueOnce({currentUser: null} as any);

    expect(await getAuthorizationToken()).toBe('some-authorization-token');

    expect(auth().currentUser?.getIdToken).toHaveBeenCalledTimes(1);

    expect(auth().signOut).toHaveBeenCalledTimes(0);
    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);
  });

  it('force refresh token if it fails', async () => {
    jest
      .mocked(auth().currentUser?.getIdToken)
      ?.mockRejectedValueOnce('some-error')
      ?.mockResolvedValueOnce('some-authorization-token');

    expect(await getAuthorizationToken()).toBe('some-authorization-token');
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledTimes(2);
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith(true);
  });

  it('recreates user on auth/invalid-refresh', async () => {
    jest
      .mocked(auth().currentUser?.getIdToken)
      ?.mockRejectedValueOnce({code: 'auth/invalid-refresh'})
      ?.mockRejectedValueOnce({code: 'auth/invalid-refresh'})
      ?.mockResolvedValueOnce('some-authorization-token');

    expect(await getAuthorizationToken()).toBe('some-authorization-token');

    expect(auth().currentUser?.getIdToken).toHaveBeenCalledTimes(3);
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith();
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith(true);

    expect(auth().signOut).toHaveBeenCalledTimes(1);
    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);
  });

  it('recreates user on auth/id-token-revoked', async () => {
    jest
      .mocked(auth().currentUser?.getIdToken)
      ?.mockRejectedValueOnce({code: 'auth/id-token-revoked'})
      ?.mockRejectedValueOnce({code: 'auth/id-token-revoked'})
      ?.mockResolvedValueOnce('some-authorization-token');

    expect(await getAuthorizationToken()).toBe('some-authorization-token');

    expect(auth().currentUser?.getIdToken).toHaveBeenCalledTimes(3);
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith();
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith(true);

    expect(auth().signOut).toHaveBeenCalledTimes(1);
    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);
  });

  it('recreates user on auth/id-token-expired', async () => {
    jest
      .mocked(auth().currentUser?.getIdToken)
      ?.mockRejectedValueOnce({code: 'auth/id-token-expired'})
      ?.mockRejectedValueOnce({code: 'auth/id-token-expired'})
      ?.mockResolvedValueOnce('some-authorization-token');

    expect(await getAuthorizationToken()).toBe('some-authorization-token');

    expect(auth().currentUser?.getIdToken).toHaveBeenCalledTimes(3);
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith();
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith(true);

    expect(auth().signOut).toHaveBeenCalledTimes(1);
    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);
  });

  it('recreates user on auth/internal-error', async () => {
    jest
      .mocked(auth().currentUser?.getIdToken)
      ?.mockRejectedValueOnce({code: 'auth/internal-error'})
      ?.mockRejectedValueOnce({code: 'auth/internal-error'})
      ?.mockResolvedValueOnce('some-authorization-token');

    expect(await getAuthorizationToken()).toBe('some-authorization-token');

    expect(auth().currentUser?.getIdToken).toHaveBeenCalledTimes(3);
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith();
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith(true);

    expect(auth().signOut).toHaveBeenCalledTimes(1);
    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);
  });
});

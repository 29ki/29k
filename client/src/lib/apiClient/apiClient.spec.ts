import auth from '@react-native-firebase/auth';
import apiClient from './apiClient';
import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';

enableFetchMocks();

afterEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
});

describe('apiClient', () => {
  it('adds default Content-Type header', async () => {
    await apiClient('/some-path');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('some-api-endpoint/some-path', {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'X-Correlation-ID': expect.any(String),
      },
    });
  });

  it('adds authorization header when user is authenticated', async () => {
    (auth().currentUser?.getIdToken as jest.Mock).mockResolvedValueOnce(
      'some-authorization-token',
    );

    await apiClient('/some-path');

    expect(auth().currentUser?.getIdToken).toHaveBeenCalledTimes(1);
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('some-api-endpoint/some-path', {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'X-Correlation-ID': expect.any(String),
        Authorization: 'bearer some-authorization-token',
      },
    });
  });

  it('forces a new token if the first fails', async () => {
    (auth().currentUser?.getIdToken as jest.Mock)
      .mockRejectedValueOnce(new Error('Failed to get token'))
      .mockResolvedValueOnce('some-authorization-token');

    await apiClient('/some-path');

    expect(auth().currentUser?.getIdToken).toHaveBeenCalledTimes(2);
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith();
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith(true);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('some-api-endpoint/some-path', {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'X-Correlation-ID': expect.any(String),
        Authorization: 'bearer some-authorization-token',
      },
    });
  });

  it('recreates user if authorization header from server fails with auth/id-token-expired', async () => {
    (auth().currentUser?.getIdToken as jest.Mock)
      .mockRejectedValueOnce({code: 'auth/id-token-expired'})
      .mockRejectedValueOnce({code: 'auth/id-token-expired'})
      .mockResolvedValueOnce('some-authorization-token');

    await apiClient('/some-path');

    expect(auth().currentUser?.getIdToken).toHaveBeenCalledTimes(3);
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith();
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith(true);

    expect(auth().signOut).toHaveBeenCalledTimes(1);
    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('some-api-endpoint/some-path', {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'X-Correlation-ID': expect.any(String),
        Authorization: 'bearer some-authorization-token',
      },
    });
  });

  it('recreates user if authorization header from server fails with auth/id-token-revoked', async () => {
    (auth().currentUser?.getIdToken as jest.Mock)
      .mockRejectedValueOnce({code: 'auth/id-token-expired'})
      .mockRejectedValueOnce({code: 'auth/id-token-expired'})
      .mockResolvedValueOnce('some-authorization-token');

    await apiClient('/some-path');

    expect(auth().currentUser?.getIdToken).toHaveBeenCalledTimes(3);
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith();
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith(true);

    expect(auth().signOut).toHaveBeenCalledTimes(1);
    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('some-api-endpoint/some-path', {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'X-Correlation-ID': expect.any(String),
        Authorization: 'bearer some-authorization-token',
      },
    });
  });

  it('thows if authorization header from server fails on other errors', async () => {
    (auth().currentUser?.getIdToken as jest.Mock)
      .mockRejectedValueOnce(new Error('Failed to get token'))
      .mockRejectedValueOnce({code: 'auth/network-request-failed'});

    await expect(apiClient('/some-path')).rejects.toThrow(
      new Error('Failed to get user token'),
    );

    expect(auth().currentUser?.getIdToken).toHaveBeenCalledTimes(2);
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith();
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith(true);

    expect(auth().signOut).toHaveBeenCalledTimes(0);
    expect(auth().signInAnonymously).toHaveBeenCalledTimes(0);

    expect(fetchMock).toHaveBeenCalledTimes(0);
  });

  it('recreates user if no user is signed in', async () => {
    (auth().currentUser?.getIdToken as jest.Mock).mockResolvedValueOnce(
      'some-authorization-token',
    );
    (auth as unknown as jest.Mock)
      .mockReturnValueOnce({currentUser: null})
      .mockReturnValueOnce({currentUser: null});

    await apiClient('/some-path');

    expect(auth().currentUser?.getIdToken).toHaveBeenCalledTimes(1);
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith();

    expect(auth().signOut).toHaveBeenCalledTimes(0);
    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('some-api-endpoint/some-path', {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'X-Correlation-ID': expect.any(String),
        Authorization: 'bearer some-authorization-token',
      },
    });
  });

  it('recreates user when server responds with 401 and calls server again', async () => {
    (auth().currentUser?.getIdToken as jest.Mock).mockResolvedValueOnce(
      'some-authorization-token',
    );
    fetchMock.mockResolvedValueOnce({status: 401} as Response);

    await apiClient('/some-path');

    expect(auth().currentUser?.getIdToken).toHaveBeenCalledTimes(2);
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith();

    expect(auth().signOut).toHaveBeenCalledTimes(1);
    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenCalledWith('some-api-endpoint/some-path', {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'X-Correlation-ID': expect.any(String),
        Authorization: 'bearer some-authorization-token',
      },
    });
  });

  it('recreates user when server responds with 400 and calls server again', async () => {
    (auth().currentUser?.getIdToken as jest.Mock).mockResolvedValueOnce(
      'some-authorization-token',
    );
    fetchMock.mockResolvedValueOnce({status: 400} as Response);

    await apiClient('/some-path');

    expect(auth().currentUser?.getIdToken).toHaveBeenCalledTimes(2);
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith();

    expect(auth().signOut).toHaveBeenCalledTimes(1);
    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenCalledWith('some-api-endpoint/some-path', {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'X-Correlation-ID': expect.any(String),
        Authorization: 'bearer some-authorization-token',
      },
    });
  });

  it('does not recreate the user when server responds with 403 Forbidden', async () => {
    (auth().currentUser?.getIdToken as jest.Mock).mockResolvedValueOnce(
      'some-authorization-token',
    );
    fetchMock.mockResolvedValueOnce({status: 403} as Response);

    await apiClient('/some-path');

    expect(auth().currentUser?.getIdToken).toHaveBeenCalledTimes(1);
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith();

    expect(auth().signOut).toHaveBeenCalledTimes(0);
    expect(auth().signInAnonymously).toHaveBeenCalledTimes(0);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('some-api-endpoint/some-path', {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'X-Correlation-ID': expect.any(String),
        Authorization: 'bearer some-authorization-token',
      },
    });
  });

  it('does not run user recreation in parallel', async () => {
    (auth().currentUser?.getIdToken as jest.Mock).mockResolvedValue(
      'some-authorization-token',
    );
    fetchMock.mockResolvedValue({status: 401} as Response);

    await Promise.all([apiClient('/some-path'), apiClient('/some-other-path')]);

    expect(auth().signOut).toHaveBeenCalledTimes(1);
    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);
  });

  it('allows overriding Content-Type and authorization', async () => {
    (auth().currentUser?.getIdToken as jest.Mock).mockResolvedValueOnce(
      'some-authorization-token',
    );

    await apiClient('/some-path', {
      headers: {
        'Content-Type': 'text/plain',
        Authorization: 'some-overridden-authorization',
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('some-api-endpoint/some-path', {
      headers: {
        'Content-Type': 'text/plain',
        'Accept-Language': 'en',
        'X-Correlation-ID': expect.any(String),
        Authorization: 'some-overridden-authorization',
      },
    });
  });
});

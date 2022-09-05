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
    await apiClient('some-url');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('some-url', {
      headers: {'Content-Type': 'application/json'},
    });
  });

  it('adds authorization header when user is authenticated', async () => {
    (auth().currentUser?.getIdToken as jest.Mock).mockResolvedValueOnce(
      'some-authorization-token',
    );

    await apiClient('some-url');

    expect(auth().currentUser?.getIdToken).toHaveBeenCalledTimes(1);
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('some-url', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer some-authorization-token',
      },
    });
  });

  it('forces a new token if the first fails', async () => {
    (auth().currentUser?.getIdToken as jest.Mock)
      .mockRejectedValueOnce(new Error('Failed to get token'))
      .mockResolvedValueOnce('some-authorization-token');

    await apiClient('some-url');

    expect(auth().currentUser?.getIdToken).toHaveBeenCalledTimes(2);
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith();
    expect(auth().currentUser?.getIdToken).toHaveBeenCalledWith(true);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('some-url', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer some-authorization-token',
      },
    });
  });

  it('allows overriding Content-Type and authorization', async () => {
    (auth().currentUser?.getIdToken as jest.Mock).mockResolvedValueOnce(
      'some-authorization-token',
    );

    await apiClient('some-url', {
      headers: {
        'Content-Type': 'text/plain',
        Authorization: 'some-overridden-authorization',
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('some-url', {
      headers: {
        'Content-Type': 'text/plain',
        Authorization: 'some-overridden-authorization',
      },
    });
  });
});

import auth from '@react-native-firebase/auth';
import apiClient from './apiClient';
import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';
import {getAuthorizationToken, recreateUser} from '../user';

enableFetchMocks();

jest.mock('../user');

const mockedGetAuthorizationToken = jest.mocked(getAuthorizationToken);
const mockedRecreateUser = jest.mocked(recreateUser);

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
    mockedGetAuthorizationToken.mockResolvedValueOnce(
      'some-authorization-token',
    );

    await apiClient('/some-path');

    expect(getAuthorizationToken).toHaveBeenCalledTimes(1);
    expect(getAuthorizationToken).toHaveBeenCalledWith();

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

  it('does not add authorization header when authorize = false', async () => {
    mockedGetAuthorizationToken.mockResolvedValueOnce(
      'some-authorization-token',
    );

    await apiClient('/some-path', undefined, false);

    expect(getAuthorizationToken).toHaveBeenCalledTimes(0);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('some-api-endpoint/some-path', {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'X-Correlation-ID': expect.any(String),
      },
    });
  });

  it('recreates user when server responds with 401 and calls server again', async () => {
    mockedGetAuthorizationToken.mockResolvedValueOnce(
      'some-authorization-token',
    );
    fetchMock.mockResolvedValueOnce({status: 401} as Response);

    await apiClient('/some-path');

    expect(getAuthorizationToken).toHaveBeenCalledTimes(2);
    expect(getAuthorizationToken).toHaveBeenCalledWith();

    expect(mockedRecreateUser).toHaveBeenCalledTimes(1);

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
    mockedGetAuthorizationToken.mockResolvedValueOnce(
      'some-authorization-token',
    );
    fetchMock.mockResolvedValueOnce({status: 400} as Response);

    await apiClient('/some-path');

    expect(mockedGetAuthorizationToken).toHaveBeenCalledTimes(2);
    expect(mockedGetAuthorizationToken).toHaveBeenCalledWith();

    expect(mockedRecreateUser).toHaveBeenCalledTimes(1);

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
    mockedGetAuthorizationToken.mockResolvedValueOnce(
      'some-authorization-token',
    );
    fetchMock.mockResolvedValueOnce({status: 403} as Response);

    await apiClient('/some-path');

    expect(mockedGetAuthorizationToken).toHaveBeenCalledTimes(1);
    expect(mockedGetAuthorizationToken).toHaveBeenCalledWith();

    expect(mockedRecreateUser).toHaveBeenCalledTimes(0);

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

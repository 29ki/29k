import {API_ENDPOINT} from 'config';
import i18next, {DEFAULT_LANGUAGE_TAG} from '../../lib/i18n';
import {getCorrelationId} from '../sentry';
import {getAuthorizationToken, recreateUser} from '../user';
import {trimSlashes} from '../utils/string';

const getAuthorizationHeader = async () => {
  const token = await getAuthorizationToken();

  if (token) {
    return {Authorization: `bearer ${token}`};
  }
};

const apiClient = async (input: string, init?: RequestInit | undefined) => {
  const doFetch = async () => {
    const authHeader = await getAuthorizationHeader();
    const correlationId = getCorrelationId();

    return fetch(`${trimSlashes(API_ENDPOINT)}/${trimSlashes(input)}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': correlationId,
        'Accept-Language': i18next.languages?.join(',') || DEFAULT_LANGUAGE_TAG,
        ...authHeader,
        ...init?.headers,
      },
    });
  };

  const response = await doFetch();

  /*
    Please note that 403 Forbidden is used by kill switch to deny access to
    the app and should not be used for user (re)authentication purposes
  */

  // 401 Unauthorized - no user detected at all
  if (response.status === 401) {
    await recreateUser();
    return await doFetch();
  }

  // TODO: Handle this by asking the user to reauthenticate if not anonymous
  // 400 Bad Request - probably have been authenticated before but now revoked
  if (response.status === 400) {
    await recreateUser();
    return await doFetch();
  }

  return response;
};

export default apiClient;

import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_ENDPOINT} from 'config';
import dayjs from 'dayjs';
import i18next, {DEFAULT_LANGUAGE_TAG} from '../../lib/i18n';
import {getCorrelationId} from '../sentry';
import {getAuthorizationToken, recreateUser} from '../user';
import {trimSlashes} from '../utils/string';
import {parse as parseCacheControl} from 'cache-control-parser';

const runtimeCacheRefs = new Map();

const getAuthorizationHeader = async () => {
  const token = await getAuthorizationToken();

  if (token) {
    return {Authorization: `bearer ${token}`};
  }
};

const apiClient = async (input: string, init?: RequestInit | undefined) => {
  const endpoint = `${trimSlashes(API_ENDPOINT)}/${trimSlashes(input)}`;

  const doFetch = async () => {
    const authHeader = await getAuthorizationHeader();
    const correlationId = getCorrelationId();

    return fetch(endpoint, {
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

  const storage = await AsyncStorage.getItem(`api-cache@${endpoint}`);
  if (storage) {
    const cache = JSON.parse(storage);

    if (dayjs.utc(cache.expiry).isAfter(dayjs.utc())) {
      if (!runtimeCacheRefs.get(endpoint)) {
        runtimeCacheRefs.set(endpoint, cache.data);
      }
      return {
        json: () => Promise.resolve(runtimeCacheRefs.get(endpoint)),
        ok: true,
      } as Response;
    }
  }

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

  const cacheControlStr = response.headers.get('cache-control');
  if (cacheControlStr) {
    const cacheControl = parseCacheControl(cacheControlStr);

    if (cacheControl['max-age']) {
      const data = await response.json();

      runtimeCacheRefs.set(endpoint, data);
      AsyncStorage.setItem(
        `api-cache@${endpoint}`,
        JSON.stringify({
          data,
          expiry: dayjs
            .utc()
            .add(cacheControl['max-age'], 'seconds')
            .toString(),
        }),
      );
    }
  }

  return response;
};

export default apiClient;

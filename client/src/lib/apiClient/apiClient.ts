import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {API_ENDPOINT} from 'config';
import i18next, {DEFAULT_LANGUAGE_TAG} from '../../lib/i18n';
import {getCorrelationId} from '../sentry';
import {trimSlashes} from '../utils/string';

const signOutAndSignIn = async () => {
  if (auth().currentUser) {
    await auth().signOut();
  }
  await auth().signInAnonymously();
};

let recreationPromise: undefined | Promise<void>;
const recreateUser = async () => {
  /* To prevent a race condition - re-use the promise to prevent this function to be run in parallel */
  if (!recreationPromise) {
    recreationPromise = signOutAndSignIn();
  }

  await recreationPromise;
  recreationPromise = undefined;
};

const getAuthorizationToken = async (): Promise<string> => {
  const {currentUser} = auth();
  if (currentUser) {
    try {
      return await currentUser.getIdToken();
    } catch {
      /*
        Failed to get id token, force refreshed token as per this issue
        https://github.com/firebase/firebase-android-sdk/issues/384
      */
      try {
        return await currentUser.getIdToken(true);
      } catch (error) {
        const firebaseError =
          error as FirebaseAuthTypes.NativeFirebaseAuthError;
        if (
          firebaseError.code === 'auth/internal-error' ||
          firebaseError.code === 'auth/id-token-expired' ||
          firebaseError.code === 'auth/id-token-revoked' ||
          firebaseError.code === 'auth/invalid-refresh'
        ) {
          await recreateUser();
          return await getAuthorizationToken();
        }

        throw new Error('Failed to get user token', {cause: error});
      }
    }
  }

  await recreateUser();
  return await getAuthorizationToken();
};

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

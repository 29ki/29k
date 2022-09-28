import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {API_ENDPOINT} from 'config';

const recreateUser = async () => {
  if (auth().currentUser) {
    await auth().signOut();
  }
  await auth().signInAnonymously();
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
        if (firebaseError.code === 'auth/network-request-failed') {
          throw new Error('Network request failed');
        }

        await recreateUser();
        return await getAuthorizationToken();
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

const trimSlashes = (str: string) => str.replace(/^\/+|\/+$/g, '');

const apiClient = async (input: string, init?: RequestInit | undefined) => {
  const doFetch = async () => {
    const authHeader = await getAuthorizationHeader();

    return fetch(`${trimSlashes(API_ENDPOINT)}/${trimSlashes(input)}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...init?.headers,
      },
    });
  };

  const response = await doFetch();

  if (response.status === 401) {
    await recreateUser();
    return await doFetch();
  }

  return response;
};

export default apiClient;

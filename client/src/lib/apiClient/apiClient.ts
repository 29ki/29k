import auth from '@react-native-firebase/auth';
import {API_ENDPOINT} from 'config';

const getAuthorizationToken = async () => {
  const {currentUser} = auth();
  if (currentUser) {
    try {
      return await currentUser.getIdToken();
    } catch (error) {
      /*
        Failed to get id token, force refreshed token as per this issue
        https://github.com/firebase/firebase-android-sdk/issues/384
      */
      return await currentUser.getIdToken(true);
    }
  }
};

const getAuthorizationHeader = async () => {
  const token = await getAuthorizationToken();

  if (token) {
    return {Authorization: `bearer ${token}`};
  }
};

const trimSlashes = (str: string) => str.replace(/^\/+|\/+$/g, '');

const apiClient = async (input: string, init?: RequestInit | undefined) =>
  fetch(`${trimSlashes(API_ENDPOINT)}/${trimSlashes(input)}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthorizationHeader()),
      ...init?.headers,
    },
  });

export default apiClient;

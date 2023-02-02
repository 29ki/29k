import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

/* To prevent a race condition - re-use the promise to prevent functions to be run in parallel */
let createPromise: undefined | Promise<FirebaseAuthTypes.UserCredential>;
let recreatePromise: undefined | Promise<void>;

export const createUser = async () => {
  if (!createPromise) {
    createPromise = auth().signInAnonymously();
  }

  await createPromise;
  createPromise = undefined;
};

export const recreateUser = async () => {
  const recreate = async () => {
    if (auth().currentUser) {
      await auth().signOut();
    }
    await createUser();
  };

  if (!recreatePromise) {
    recreatePromise = recreate();
  }

  await recreatePromise;
  recreatePromise = undefined;
};

export const ensureUserCreated = async () => {
  if (!auth().currentUser) {
    await createUser();
  }
};

export const getAuthorizationToken = async (): Promise<string> => {
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

  await createUser();
  return await getAuthorizationToken();
};

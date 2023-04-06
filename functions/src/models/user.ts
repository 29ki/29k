import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';
import {getData} from '../../../shared/src/modelUtils/firestore';
import {UserData} from '../../../shared/src/types/User';

const USERS_COLLECTION = 'users';

export const updateUser = async (id: string, userData: Partial<UserData>) => {
  const now = Timestamp.now();
  await firestore()
    .collection(USERS_COLLECTION)
    .doc(id)
    .set({...userData, updatedAt: now}, {merge: true});
};

export const getUser = async (id: string) => {
  const userRef = await firestore().collection(USERS_COLLECTION).doc(id).get();
  if (userRef.exists) {
    return getData<UserData>(userRef);
  }
  return null;
};

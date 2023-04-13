import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';
import {getData} from '../../../shared/src/modelUtils/firestore';
import {UserData} from '../../../shared/src/types/User';

const USERS_COLLECTION = 'users';

type User = UserData & {id: string};
type UserFilters = {
  role: string;
};

export const updateUser = async (id: string, userData: Partial<UserData>) => {
  const now = Timestamp.now();
  await firestore()
    .collection(USERS_COLLECTION)
    .doc(id)
    .set({...userData, updatedAt: now}, {merge: true});
};

export const getUsers = async (filters: Partial<UserFilters>) => {
  const ref = firestore().collection(USERS_COLLECTION);
  let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> | null =
    null;

  for (const prop of Object.keys(filters)) {
    if (query === null) {
      query = ref.where(prop, '==', filters[prop as keyof UserFilters]);
    } else {
      query = query.where(prop, '==', filters[prop as keyof UserFilters]);
    }
  }

  const snapshot = await (query ?? ref).get();
  return snapshot.docs.map(doc => getData<User>(doc));
};

export const getUser = async (id: string) => {
  const userRef = await firestore().collection(USERS_COLLECTION).doc(id).get();
  if (userRef.exists) {
    return getData<UserData>(userRef);
  }
  return null;
};

import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';
import {getData} from '../../../shared/src/modelUtils/firestore';
import {UserFilters, UserInput, UserRecord} from './types/types';

const USERS_COLLECTION = 'users';

export const updateUser = async (id: string, userData: Partial<UserInput>) => {
  const now = Timestamp.now();
  await firestore()
    .collection(USERS_COLLECTION)
    .doc(id)
    .set({...userData, updatedAt: now}, {merge: true});
};

export const incrementHostedCount = async (
  id: string,
  countProperty: keyof Pick<
    UserRecord,
    'hostedPrivateCount' | 'hostedPublicCount'
  >,
) => {
  const userRef = firestore().collection(USERS_COLLECTION).doc(id);
  await firestore().runTransaction(async transaction => {
    const document = await transaction.get(userRef);
    const user = document.exists
      ? getData<UserRecord>(document)
      : ({} as UserRecord);
    const updatedAt = Timestamp.now();
    transaction.set(
      userRef,
      {
        [countProperty]: (user[countProperty] ?? 0) + 1,
        updatedAt,
      },
      {merge: true},
    );
  });
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
  return snapshot.docs.map(doc => getData<UserRecord>(doc));
};

export const getUser = async (id: string) => {
  const userRef = await firestore().collection(USERS_COLLECTION).doc(id).get();
  if (userRef.exists) {
    return getData<UserRecord>(userRef);
  }
  return null;
};

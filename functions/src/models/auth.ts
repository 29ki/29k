import {getAuth} from 'firebase-admin/auth';
import {ROLE} from '../../../shared/src/schemas/User';
import {UserProfileRecord} from './types/types';

export const getAuthUserInfo = async (
  userId: string,
): Promise<UserProfileRecord> => {
  const user = await getAuth().getUser(userId);

  return {
    uid: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};

export const updateRole = async (userId: string, role: ROLE | null) => {
  await getAuth().setCustomUserClaims(userId, {role});
};

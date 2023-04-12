import {getAuth} from 'firebase-admin/auth';
import {UserProfile, ROLE} from '../../../shared/src/types/User';

export const getAuthUserInfo = async (userId: string): Promise<UserProfile> => {
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

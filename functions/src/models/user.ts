import {getAuth} from 'firebase-admin/auth';
import {UserProfile} from '../../../shared/src/types/User';

export const getPublicUserInfo = async (
  userId: string,
): Promise<UserProfile> => {
  const user = await getAuth().getUser(userId);

  return {
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};

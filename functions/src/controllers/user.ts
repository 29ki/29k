import {getPublicUserInfo} from '../models/user';
import {RequestError} from './errors/RequestError';
import {UserProfileError} from '../../../shared/src/errors/User';

export const getProfile = async (userId: string) => {
  const userProfile = await getPublicUserInfo(userId);

  if (!userProfile || (!userProfile.displayName && !userProfile.photoURL)) {
    throw new RequestError(UserProfileError.userNotFound);
  }

  return userProfile;
};

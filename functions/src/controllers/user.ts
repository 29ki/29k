import {getAuthUserInfo} from '../models/auth';
import {RequestError} from './errors/RequestError';
import {UserError} from '../../../shared/src/errors/User';
import {User, UserData} from '../../../shared/src/types/User';
import * as userModel from '../models/user';

export const getMe = async (userId: string): Promise<UserData | null> => {
  const user = await userModel.getUser(userId);
  if (user) {
    return user;
  }
  return {};
};

export const getUser = async (userId: string): Promise<User> => {
  const user = await userModel.getUser(userId);
  const userProfile = await getAuthUserInfo(userId);

  if (!userProfile || (!userProfile.displayName && !userProfile.photoURL)) {
    throw new RequestError(UserError.userNotFound);
  }

  if (!user) {
    return userProfile;
  }

  return {...user, ...userProfile};
};

export const updateUser = async (userId: string, data: Partial<UserData>) => {
  await userModel.updateUser(userId, data);
};

import {getAuthUserInfo} from '../models/auth';
import {RequestError} from './errors/RequestError';
import {UserError} from '../../../shared/src/errors/User';
import {ROLE, UserData} from '../../../shared/src/schemas/User';
import * as userModel from '../models/user';
import {UserDataModel, UserModel} from './types/types';

export const getMe = async (userId: string): Promise<UserDataModel | null> => {
  const user = await userModel.getUser(userId);
  if (user) {
    return user;
  }
  return {};
};

export const getPublicHosts = async (): Promise<Array<UserModel>> => {
  const hosts = await userModel.getUsers({role: ROLE.publicHost});
  return Promise.all(
    hosts.map(async host => {
      const userProfile = await getAuthUserInfo(host.id);
      return {
        ...(userProfile ? userProfile : {uid: host.id}),
        ...host,
      };
    }),
  );
};

export const getUser = async (userId: string): Promise<UserModel> => {
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

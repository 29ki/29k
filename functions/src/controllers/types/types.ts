import {
  LiveSessionRecord,
  UserProfileRecord,
  UserRecord,
} from '../../models/types/types';

export type UserDataModel = Omit<UserRecord, 'id'>;

export type UserModel = UserDataModel & UserProfileRecord;

export type LiveSessionModel = LiveSessionRecord & {
  hostProfile: UserModel | null;
};

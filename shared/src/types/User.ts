import {UserRecord} from 'firebase-admin/auth';

export enum ROLE {
  publicHost = 'publicHost',
}

export type UserProfile = Pick<UserRecord, 'uid' | 'displayName' | 'photoURL'>;

export type UserData = {
  description?: string;
  role?: ROLE;
};

export type User = UserProfile & UserData;

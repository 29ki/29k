import {UserRecord} from 'firebase-admin/auth';

export const ROLES = {
  publicHost: 'publicHost',
};

export type UserProfile = Pick<UserRecord, 'uid' | 'displayName' | 'photoURL'>;

export type UserData = {
  description?: string;
};

export type User = UserProfile & UserData;

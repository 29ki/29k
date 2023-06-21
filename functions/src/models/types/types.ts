import {Timestamp} from 'firebase-admin/firestore';
import {SessionMode, SessionType} from '../../../../shared/src/schemas/Session';
import {ROLE} from '../../../../shared/src/schemas/User';
import {LANGUAGE_TAG} from '../../lib/i18n';

export type RequestStatus = 'requested' | 'accepted' | 'declined' | 'verified';

export type RequestData = {
  verificationCode?: number;
  status: RequestStatus;
  createdAt?: Timestamp;
  updatedAt: Timestamp;
};

export type UserRecord = {
  id: string;
  description?: string;
  role?: ROLE;
  hostedPublicCount?: number;
  hostedPrivateCount?: number;
};

export type UserProfileRecord = {
  uid: string;
  displayName?: string;
  photoURL?: string;
};

export type UserFilters = {
  role: string;
};

export type UserInput = Omit<UserRecord, 'id'>;

export type PostRecord = {
  id: string;
  exerciseId: string;
  language: LANGUAGE_TAG;
  sharingId: string;
  userId: string | null;
  approved: boolean;
  text: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type PostInput = Omit<PostRecord, 'id' | 'createdAt' | 'updatedAt'>;

export type LiveSessionRecord = {
  id: string;
  mode: SessionMode;
  type: SessionType;
  exerciseId: string;
  language: LANGUAGE_TAG;
  dailyRoomName: string;
  url: string;
  link?: string;
  inviteCode: number;
  hostingCode?: number | null;
  interestedCount: number;
  hostId: string;
  userIds: Array<string>;
  ended: boolean;
  closingTime: Timestamp;
  startTime: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type LiveSessionInput = Omit<
  LiveSessionRecord,
  | 'mode'
  | 'ended'
  | 'userIds'
  | 'startTime'
  | 'createdAt'
  | 'updatedAt'
  | 'closingTime'
  | 'hostProfile'
> & {
  startTime: string;
  dailyRoomName: string;
};

export type SessionStateRecord = {
  id: string;
  index: number;
  playing: boolean;
  started: boolean;
  ended: boolean;
  completed?: boolean;
  timestam: Timestamp;
};

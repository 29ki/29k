import type {Timestamp} from 'firebase-admin/firestore';
import * as yup from 'yup';
import {LANGUAGE_TAG, LANGUAGE_TAGS} from '../constants/i18n';
import {UserSchema} from './User';

export enum SessionMode {
  async = 'async',
  live = 'live',
}

export enum SessionType {
  private = 'private',
  public = 'public',
}

const SessionStateFieldsSchema = yup.object({
  index: yup.number().required(),
  playing: yup.boolean().required(),
  started: yup.boolean().required(),
  ended: yup.boolean().required(),
  id: yup.string().required(),
  completed: yup.boolean(),
});
type SessionStateFields = yup.InferType<typeof SessionStateFieldsSchema>;

const SessionBaseFiledsSchema = yup.object({
  id: yup.string().required(),
  mode: yup.mixed<SessionMode>().oneOf(Object.values(SessionMode)).required(),
  type: yup.mixed<SessionType>().oneOf(Object.values(SessionType)).required(),
  exerciseId: yup.string().required(),
  language: yup.mixed<LANGUAGE_TAG>().oneOf(LANGUAGE_TAGS).required(),
});

const LiveSessionFieldsSchema = yup
  .object({
    dailyRoomName: yup.string().required(),
    url: yup.string().required(),
    link: yup.string(),
    inviteCode: yup.number().required(),
    interestedCount: yup.number().required(),
    hostId: yup.string().required(),
    userIds: yup.array().of(yup.string()).required(),
    ended: yup.boolean().required(),
  })
  .concat(SessionBaseFiledsSchema);
type LiveSessionFields = yup.InferType<typeof LiveSessionFieldsSchema>;

// Data stored in DB
export type SessionStateData = SessionStateFields & {
  timestamp: Timestamp;
};

export type LiveSessionData = LiveSessionFields & {
  closingTime: Timestamp;
  startTime: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

// Applicaton schema
export const SessionStateSchema = yup
  .object({
    timestamp: yup.string(),
  })
  .concat(SessionStateFieldsSchema);
export type SessionState = yup.InferType<typeof SessionStateSchema>;

export const LiveSessionSchema = yup
  .object({
    closingTime: yup.string().required(),
    startTime: yup.string().required(),
    createdAt: yup.string().required(),
    updatedAt: yup.string().required(),
    hostProfile: yup.object().concat(UserSchema).nullable(),
  })
  .concat(LiveSessionFieldsSchema);
export type LiveSession = yup.InferType<typeof LiveSessionSchema>;

export const AsyncSessionSchema = yup
  .object({
    startTime: yup.string().required(),
  })
  .concat(SessionBaseFiledsSchema);
export type AsyncSession = yup.InferType<typeof AsyncSessionSchema>;

export type DailyUserData = {
  inPortal: boolean;
  photoURL?: string;
};

import type {Timestamp} from 'firebase-admin/firestore';
import {LANGUAGE_TAG} from '../constants/i18n';
import {User} from './User';

export enum SessionMode {
  async = 'async',
  live = 'live',
}

export enum SessionType {
  private = 'private',
  public = 'public',
}

type SessionStateFields = {
  index: number;
  playing: boolean;
  started: boolean;
  ended: boolean;
  id: string;
  completed?: boolean;
};

type SessionBaseFileds = {
  id: string;
  mode: SessionMode;
  type: SessionType;
  exerciseId: string;
  language: LANGUAGE_TAG;
};

type LiveSessionFields = SessionBaseFileds & {
  dailyRoomName: string;
  url: string;
  link?: string;
  inviteCode: number;
  interestedCount: number;
  hostId: string;
  userIds: string[];
  ended: boolean;
};

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
export type SessionState = SessionStateFields & {
  timestamp: string;
};

export type LiveSession = LiveSessionFields & {
  closingTime: string;
  startTime: string;
  createdAt: string;
  updatedAt: string;
  hostProfile?: User;
};

export type AsyncSession = SessionBaseFileds & {startTime: string};

export type DailyUserData = {
  inPortal: boolean;
  photoURL?: string;
};

import type {Timestamp} from 'firebase-admin/firestore';
import {LANGUAGE_TAG} from '../constants/i18n';
import {UserProfile} from './User';

export enum SessionType {
  async = 'async',
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
  type: SessionType;
  contentId: string;
  language: LANGUAGE_TAG;
};

type SessionFields = SessionBaseFileds & {
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

export type SessionData = SessionFields & {
  startTime: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

// Applicaton schema
export type SessionState = SessionStateFields & {
  timestamp: string;
};

export type Session = SessionFields & {
  startTime: string;
  createdAt: string;
  updatedAt: string;
  hostProfile?: UserProfile;
};

export type AsyncSession = SessionBaseFileds & {startTime: string};

export type DailyUserData = {
  inPortal: boolean;
  photoURL?: string;
};

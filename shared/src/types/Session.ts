import type {Timestamp} from 'firebase-admin/firestore';
import {LANGUAGE_TAG} from '../constants/i18n';
import {UserProfile} from './User';

export enum SessionType {
  public = 'public',
  private = 'private',
}

type SessionStateFields = {
  index: number;
  playing: boolean;
  dailySpotlightId?: string;
  started: boolean;
  ended: boolean;
};

type SessionFields = {
  id: string;
  url: string;
  language: LANGUAGE_TAG;
  link?: string;
  contentId: string;
  inviteCode: number;
  hostId: string;
  type: SessionType;
  userIds: string[];
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

export type DailyUserData = {
  inPortal: boolean;
  photoURL?: string;
};

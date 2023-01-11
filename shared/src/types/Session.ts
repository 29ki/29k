import type {Timestamp} from 'firebase-admin/firestore';
import {LANGUAGE_TAG} from '../constants/i18n';
import {UserProfile} from './User';

export enum SessionType {
  public = 'public',
  private = 'private',
}

type ExerciseStateFields = {
  index: number;
  playing: boolean;
  completed?: boolean;
};

type SessionFields = {
  id: string;
  dailyRoomName: string;
  url: string;
  language: LANGUAGE_TAG;
  link?: string;
  contentId: string;
  inviteCode: number;
  hostId: string;
  started: boolean;
  ended: boolean;
  type: SessionType;
  userIds: string[];
};

// Data stored in DB
export type ExerciseStateData = ExerciseStateFields & {
  timestamp: Timestamp;
};

export type SessionData = SessionFields & {
  startTime: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  exerciseState: ExerciseStateData;
};

// Applicaton schema
export type ExerciseState = ExerciseStateFields & {
  timestamp: string;
};

export type Session = SessionFields & {
  startTime: string;
  createdAt: string;
  updatedAt: string;
  exerciseState: ExerciseState;
  hostProfile?: UserProfile;
};

export type DailyUserData = {
  inPortal: boolean;
  photoURL?: string;
};

import type {Timestamp} from 'firebase-admin/firestore';
import {LANGUAGE_TAG} from '../constants/i18n';
import {UserProfile} from './User';

export enum SessionType {
  public = 'public',
  private = 'private',
}

// Data stored in DB
export type ExerciseStateData = Omit<ExerciseState, 'timestamp'> & {
  timestamp: Timestamp;
};

export type SessionData = Omit<Session, 'exerciseState' | 'startTime'> & {
  exerciseState: ExerciseStateData;
  startTime: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

// Applicaton schema
export type ExerciseState = {
  index: number;
  playing: boolean;
  dailySpotlightId?: string;
  timestamp: string;
};

export type Session = {
  id: string;
  url: string;
  language: LANGUAGE_TAG;
  link?: string;
  exerciseState: ExerciseState;
  contentId: string;
  inviteCode: number;
  hostProfile: UserProfile;
  hostId: string;
  startTime: string;
  started: boolean;
  ended: boolean;
  type: SessionType;
  userIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type DailyUserData = {
  inPortal: boolean;
  photoURL?: string;
};

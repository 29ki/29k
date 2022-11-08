import type {Timestamp} from 'firebase-admin/firestore';
import {LANGUAGE_TAG} from '../constants/i18n';
import {UserProfile} from './User';

export enum SessionType {
  public = 'public',
  private = 'private',
}

// Input to DB
export type ExerciseStateInput = Omit<ExerciseState, 'timestamp'> & {
  timestamp: Timestamp;
};

export type SessionInput = Omit<Session, 'exerciseState' | 'startTime'> & {
  exerciseState: ExerciseStateInput;
  startTime: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

// Data stored in DB
export type ExerciseStateData = ExerciseStateInput;

export type SessionData = SessionInput;

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
  photoURL: string;
};

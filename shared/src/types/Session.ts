import type {Timestamp} from 'firebase-admin/firestore';

export enum SessionType {
  private = 'private',
  public = 'public',
  async = 'async',
}

// Input to DB
export type ExerciseStateInput = Omit<ExerciseState, 'timestamp'> & {
  timestamp: Timestamp;
};

export type SessionInput = Omit<Omit<Session, 'exerciseState'>, 'startTime'> & {
  exerciseState: ExerciseStateInput;
  startTime: Timestamp;
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
  link?: string;
  exerciseState: ExerciseState;
  contentId: string;
  facilitator: string;
  startTime: string;
  started: boolean;
  ended: boolean;
  type: SessionType;
};

export type DailyUserData = {
  inPortal: boolean;
};

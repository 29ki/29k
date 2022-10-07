import type {Timestamp} from 'firebase-admin/firestore';

// Input to DB
export type ExerciseStateInput = Omit<ExerciseState, 'timestamp'> & {
  timestamp: Timestamp;
};

export type TempleInput = Omit<Temple, 'exerciseState'> & {
  exerciseState: ExerciseStateInput;
};

// Data stored in DB
export type ExerciseStateData = ExerciseStateInput;

export type TempleData = TempleInput;

// Applicaton schema
export type ExerciseState = {
  index: number;
  playing: boolean;
  dailySpotlightId?: string;
  timestamp: string;
};

export type Temple = {
  id: string;
  name: string;
  url: string;
  exerciseState: ExerciseState;
  contentId: string;
  facilitator: string;
  started: boolean;
  ended: boolean;
};

export type DailyUserData = {
  inPortal: boolean;
};

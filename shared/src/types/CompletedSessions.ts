import {Timestamp} from 'firebase-admin/firestore';

type CompletedSessionsCountFields = {
  exerciseId: string;
  asyncCount: number;
  privateCount: number;
  publicCount: number;
};

export type CompletedSessionsCountData = CompletedSessionsCountFields & {
  updatedAt: Timestamp;
};

export type CompletedSessionsCount = CompletedSessionsCountFields;

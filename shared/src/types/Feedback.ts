import {SessionMode, SessionType} from '../schemas/Session';

export type Feedback = {
  id: string;
  exerciseId: string;
  completed: boolean;
  sessionId: string;
  host?: boolean;

  question: string;
  answer: boolean;
  comment?: string;

  sessionMode: SessionMode;
  sessionType: SessionType;

  approved: boolean;
  createdAt?: string;
};

export type FeedbackInput = Omit<Feedback, 'id' | 'approved'>;

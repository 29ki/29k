import {LiveSession} from '../schemas/Session';
import {UserProfile} from '../schemas/User';

export type PostPayload = {
  sessionId: string;
  exerciseId: string;
  sharingId: string;
  isPublic: boolean;
  isAnonymous: boolean;
  text: string;
};

export type FeedbackPayload = {
  question: string;
  answer: boolean;
  comment?: string;
  exerciseId: string;
  sessionId: string;
};

export type CompletedSessionPayload = {
  id: LiveSession['id'];
  hostId?: LiveSession['hostId'];
  exerciseId: LiveSession['exerciseId'];
  language: LiveSession['language'];
  type: LiveSession['type'];
  mode: LiveSession['mode'];
  hostProfile?: UserProfile;
};

type BaseEvent = {
  timestamp: string;
};

export type PostEvent = BaseEvent & {
  type: 'post';
  payload: PostPayload;
};

export type FeedbackEvent = BaseEvent & {
  type: 'feedback';
  payload: FeedbackPayload;
};

export type CompletedSessionEvent = BaseEvent & {
  type: 'completedSession';
  payload: CompletedSessionPayload;
};

export type UserEvent = PostEvent | FeedbackEvent | CompletedSessionEvent;

export type PostEventData = Omit<PostEvent, 'timestamp'>;
export type FeedbackEventData = Omit<FeedbackEvent, 'timestamp'>;
export type CompletedSessionEventData = Omit<
  CompletedSessionEvent,
  'timestamp'
>;
export type UserEventData = Omit<UserEvent, 'timestamp'>;

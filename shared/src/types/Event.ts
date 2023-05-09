import {LiveSessionType} from '../schemas/Session';
import {UserProfileType} from '../schemas/User';

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
  id: LiveSessionType['id'];
  hostId?: LiveSessionType['hostId'];
  exerciseId: LiveSessionType['exerciseId'];
  language: LiveSessionType['language'];
  type: LiveSessionType['type'];
  mode: LiveSessionType['mode'];
  hostProfile?: UserProfileType;
};

export type CompletedCollectionPayload = {
  id: string;
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

export type CompletedCollectionEvent = BaseEvent & {
  type: 'completedCollection';
  payload: CompletedCollectionPayload;
};

export type UserEvent =
  | PostEvent
  | FeedbackEvent
  | CompletedSessionEvent
  | CompletedCollectionEvent;

export type PostEventData = Omit<PostEvent, 'timestamp'>;
export type FeedbackEventData = Omit<FeedbackEvent, 'timestamp'>;
export type CompletedSessionEventData = Omit<
  CompletedSessionEvent,
  'timestamp'
>;
export type CompletedCollectionEventData = Omit<
  CompletedCollectionEvent,
  'timestamp'
>;
export type UserEventData = Omit<UserEvent, 'timestamp'>;

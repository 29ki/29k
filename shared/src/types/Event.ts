export type PostPayload = {
  sessionId: string;
  exerciseId: string;
  sharingId: string;
  isPublic: boolean;
  isAnonymous: boolean;
  text: string;
};

export type FeedbackPayload = {
  like: boolean;
  text?: string;
};

type BaseEvent = {
  timestamp: Date;
};

export type PostEvent = BaseEvent & {
  type: 'post';
  payload: PostPayload;
};

export type FeedbackEvent = BaseEvent & {
  type: 'feedback';
  payload: FeedbackPayload;
};

export type UserEvent = PostEvent | FeedbackEvent;

export type PostEventData = Omit<PostEvent, 'timestamp'>;
export type FeedbackEventData = Omit<FeedbackEvent, 'timestamp'>;
export type UserEventData = Omit<UserEvent, 'timestamp'>;

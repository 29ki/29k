import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import {Session} from '../../../../../shared/src/types/Session';
import {LANGUAGE_TAG} from '../../i18n';

// General properties
export type Language = {Language: LANGUAGE_TAG};
export type Host = {Host: boolean};

// Navigation properties
export type ScreenName = {'Screen Name': string};

// Exercise properties
export type ExerciseID = {
  'Exercise ID': Exercise['id'];
};

// Sharing Session properties - named "Sharing Session" to not be confused with a user "session" in PostHog
export type SharingSessionID = {
  'Sharing Session ID': Session['id'];
};
export type SharingSessionType = {
  'Sharing Session Type': Session['type'];
};
export type SharingSessionStartTime = {
  'Sharing Session Start Time': Session['startTime'];
};
export type SharingSessionDuration = {
  'Sharing Session Duration': number; // Seconds
};
export type SharingSessionProperties = SharingSessionID &
  SharingSessionType &
  SharingSessionStartTime &
  ExerciseID &
  Host &
  Language;

// Feedback properties
export type FeedbackAnswer = {
  'Feedback Answer'?: boolean;
};
export type FeedbackQuestion = {
  'Feedback Question': string;
};
export type FeedbackComment = {
  'Feedback Comment'?: string;
};
export type FeedbackProperties = FeedbackAnswer &
  FeedbackQuestion &
  FeedbackComment;

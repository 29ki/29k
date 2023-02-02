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
export type SharingSessionProperties = {
  'Sharing Session ID': Session['id'];
  'Sharing Session Type': Session['type'];
  'Sharing Session Start Time': Session['startTime'];
};
export type SharingSessionDuration = {
  'Sharing Session Duration': number; // Seconds
};

// Feedback properties
export type FeedbackProperties = ExerciseID & {
  'Feedback Question': string;
  'Feedback Answer': boolean;
  'Feedback Comment'?: string;
  'Sharing Session ID'?: string;
  'Sharing Session Completed': boolean;
  Host?: boolean;
};

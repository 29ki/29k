import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import {LiveSession} from '../../../../../shared/src/types/Session';
import {LANGUAGE_TAG} from '../../i18n';

// General properties
export type Origin = {Origin?: string}; // Where is the event originating from
export type Language = {Language: LANGUAGE_TAG};
export type Host = {Host: boolean};

// Properties available to all events
export type DefaultProperties = Origin | undefined;

// Navigation properties
export type ScreenName = {'Screen Name': string};

// Exercise properties
export type ExerciseID = {
  'Exercise ID': Exercise['id'];
};

// Sharing Session properties - named "Sharing Session" to not be confused with a user "session" in PostHog
export type SharingSessionProperties = {
  'Sharing Session ID': LiveSession['id'];
  'Sharing Session Type': LiveSession['type'];
  'Sharing Session Mode': LiveSession['mode'];
  'Sharing Session Start Time': LiveSession['startTime'];
} & ExerciseID &
  Host &
  Language;

export type SharingSessionDuration = {
  'Sharing Session Duration': number; // Seconds
};

export type SharingSessionPost = {
  'Sharing Session Post Public': boolean;
  'Sharing Session Post Anonymous': boolean;
};

// Feedback properties
export type FeedbackProperties = {
  'Feedback Question': string;
  'Feedback Answer': boolean;
  'Feedback Comment'?: string;
  'Sharing Session ID'?: string;
  'Sharing Session Completed': boolean;
  Host?: boolean;
} & ExerciseID;

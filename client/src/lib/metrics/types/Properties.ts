import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import {Collection} from '../../../../../shared/src/types/generated/Collection';
import {
  LiveSessionType,
  SessionMode,
  SessionType,
} from '../../../../../shared/src/schemas/Session';
import {LANGUAGE_TAG} from '../../i18n';
import {REMINDER_INTERVALS} from '../../reminders/constants';

// General properties
export type Origin = {Origin?: string}; // Where is the event originating from
export type OriginSource = {'Origin Source'?: string};
export type OriginMedium = {'Origin Medium'?: string};
export type OriginCampaign = {'Origin Campaign'?: string};
export type Language = {Language: LANGUAGE_TAG};
export type Host = {Host: boolean};
export type Enable = {Enable: boolean};

// Properties available to all events
export type DefaultProperties = Origin | undefined;

// Navigation properties
export type ScreenName = {'Screen Name': string} & OriginSource &
  OriginMedium &
  OriginCampaign;

// Exercise properties
export type ExerciseID = {
  'Exercise ID': Exercise['id'];
};

// Sharing Session properties - named "Sharing Session" to not be confused with a user "session" in PostHog
export type SharingSessionProperties = {
  'Sharing Session ID': LiveSessionType['id'];
  'Sharing Session Type': SessionType;
  'Sharing Session Mode': SessionMode;
  'Sharing Session Start Time': LiveSessionType['startTime'];
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
  'Sharing Session Type': SessionType;
  'Sharing Session Mode': SessionMode;
  Host?: boolean;
} & ExerciseID;

// Collection properties
export type CollectionID = {
  'Collection ID': Collection['id'];
};
export type CollectionProperties = CollectionID;

//Reminder properties
export type ReminderProperties = {
  'Notification ID': string;
  'Notification Channel ID': string;
};

export type ReminderSettingsProperties = {
  'Reminder Interval': REMINDER_INTERVALS;
  'Reminder Hour': number;
  'Reminder Minute': number;
};

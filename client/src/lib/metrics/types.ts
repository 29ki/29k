import {Session} from '../../../../shared/src/types/Session';

export type Events = {
  'Add Session To Calendar': {
    'Session Exercise ID': Session['contentId'];
    'Session Language': Session['language'];
    'Session Type': Session['type'];
    'Session Start Time': Session['startTime'];
  };
  'Add Session Reminder': {
    'Session Exercise ID': Session['contentId'];
    'Session Language': Session['language'];
    'Session Type': Session['type'];
    'Session Start Time': Session['startTime'];
  };
  'Share Session': {
    'Session Exercise ID': Session['contentId'];
    'Session Language': Session['language'];
    'Session Type': Session['type'];
    'Session Start Time': Session['startTime'];
  };
  'Join Session': {
    'Session Exercise ID': Session['contentId'];
    'Session Language': Session['language'];
    'Session Type': Session['type'];
    'Session Start Time': Session['startTime'];
  };
};

export type UserProperties = {
  Anonymous: boolean;
};

export type CoreProperties = {
  'App Git Commit': string;
};

import {LiveSessionType} from '../../../../../../shared/src/schemas/Session';
import {
  CompletedSessionEvent,
  PostEvent,
} from '../../../../../../shared/src/types/Event';
import {PinnedCollection} from '../../../../lib/user/state/state';

export type Section = {
  title: string;
  data: Item[];
  type:
    | 'plannedSessions'
    | 'completedSessions'
    | 'pinnedCollections'
    | 'filters';
};

export type Item =
  | CompletedSessionItem
  | FilterItem
  | PinnedCollectionItem
  | PlannedSessionItem;

export type CompletedSessionItem = {
  id: string;
  type: 'completedSession';
  data: CompletedSessionEvent & {sharingPost?: PostEvent};
  isLast: boolean;
  isFirst: boolean;
};

type FilterItem = {
  id: string;
  type: 'filter';
};

type PinnedCollectionItem = {
  id: string;
  type: 'pinnedCollection';
  data: PinnedCollection;
};

type PlannedSessionItem = {
  id: string;
  type: 'plannedSession';
  data: LiveSessionType;
};

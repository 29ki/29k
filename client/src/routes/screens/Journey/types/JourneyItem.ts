import {CompletedSessionEvent} from '../../../../../../shared/src/types/Event';
import {PinnedCollection} from '../../../../lib/user/state/state';

export interface JourneyItem {
  id: string;
  completedSession?: CompletedSessionEvent;
  savedCollection?: PinnedCollection;
  completedSessionsFilter?: boolean;
}

import {CompletedSessionEvent} from '../../../../../../shared/src/types/Event';
import {SavedCollection} from '../../../../lib/user/state/state';

export interface JourneyItem {
  id: string;
  completedSession?: CompletedSessionEvent;
  savedCollection?: SavedCollection;
}

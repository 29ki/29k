import {CompletedSessionEvent} from '../../../../../shared/src/types/Event';
import {LiveSession} from '../../../../../shared/src/types/Session';

export interface JourneySession {
  id: LiveSession['id'];
  completedSession?: CompletedSessionEvent;
}

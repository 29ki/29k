import {LiveSession} from '../../../../../shared/src/types/Session';

export interface JourneySession {
  id: LiveSession['id'];
  __type?: 'completed';
}

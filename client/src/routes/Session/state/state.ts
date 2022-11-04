import {atom, selector} from 'recoil';
import {
  ExerciseStateData,
  SessionData,
} from '../../../../../shared/src/types/Session';

const SESSION_NAMESPACE = 'Session';

export const sessionAtom = atom<SessionData | null>({
  key: `${SESSION_NAMESPACE}/session`,
  default: null,
});

export const sessionExerciseStateSelector = selector<ExerciseStateData | null>({
  key: `${SESSION_NAMESPACE}/exerciseStateSelector`,
  get: ({get}) => get(sessionAtom)?.exerciseState || null,
});

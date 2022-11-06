import {atom, selector} from 'recoil';
import {
  ExerciseStateData,
  SessionData,
} from '../../../../../shared/src/types/Session';
import create from 'zustand';

const SESSION_NAMESPACE = 'Session';

export const sessionAtom = atom<SessionData | null>({
  key: `${SESSION_NAMESPACE}/session`,
  default: null,
});

export const sessionExerciseStateSelector = selector<ExerciseStateData | null>({
  key: `${SESSION_NAMESPACE}/exerciseStateSelector`,
  get: ({get}) => get(sessionAtom)?.exerciseState || null,
});

type State = {
  session: SessionData | null;
};

type Actions = {
  setState: (session: SessionData) => void;
  reset: () => void;
};

const initialState = {
  session: null,
};

const useSessionState = create<State & Actions>()(set => ({
  ...initialState,
  setState: session => set({session}),
  reset: () => set(initialState),
}));

export default useSessionState;

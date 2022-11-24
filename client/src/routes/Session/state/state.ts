import {Session} from '../../../../../shared/src/types/Session';
import create from 'zustand';

type State = {
  session: Session | null;
};

type Actions = {
  setState: (session: Session) => void;
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

import {Session} from '../../../../../shared/src/types/Session';
import create from 'zustand';

type State = {
  session: Session | null;
  currentContentReachedEnd: boolean;
};

type Actions = {
  setState: (session: Session) => void;
  setCurrentContentReachedEnd: (currentContentReachedEnd: boolean) => void;
  reset: () => void;
};

const initialState: State = {
  session: null,
  currentContentReachedEnd: false,
};

const useSessionState = create<State & Actions>()(set => ({
  ...initialState,
  setState: session => set({session}),
  setCurrentContentReachedEnd: currentContentReachedEnd =>
    set({currentContentReachedEnd}),
  reset: () => set(initialState),
}));

export default useSessionState;

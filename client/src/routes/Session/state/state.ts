import {Session} from '../../../../../shared/src/types/Session';
import create from 'zustand';

type State = {
  session: Session | null;
  currentSlideDone: boolean;
};

type Actions = {
  setState: (session: Session) => void;
  setCurrentSlideDone: (currentSlideDone: boolean) => void;
  reset: () => void;
};

const initialState: State = {
  session: null,
  currentSlideDone: false,
};

const useSessionState = create<State & Actions>()(set => ({
  ...initialState,
  setState: session => set({session}),
  setCurrentSlideDone: currentSlideDone => set({currentSlideDone}),
  reset: () => set(initialState),
}));

export default useSessionState;

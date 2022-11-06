import {SessionData} from '../../../../../shared/src/types/Session';
import create from 'zustand';

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

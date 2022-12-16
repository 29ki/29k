import {Session, SessionState} from '../../../../../shared/src/types/Session';
import create from 'zustand';

type State = {
  session: Session | null;
  state: SessionState | null;
};

type Actions = {
  setState: (sessionState: SessionState) => void;
  reset: () => void;
};

const initialState = {
  session: null,
  state: null,
};

const useSessionState = create<State & Actions>()(set => ({
  ...initialState,
  setState: state => set({state}),
  reset: () => set(initialState),
}));

export default useSessionState;

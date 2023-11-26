import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import {create} from 'zustand';

type State = {
  sessions: LiveSessionType[];
};

type Actions = {
  setSessions: (sessions: State['sessions']) => void;
  reset: () => void;
};

const initialState: State = {
  sessions: [],
};

const useSessionsState = create<State & Actions>()(set => ({
  ...initialState,
  setSessions: sessions => set({sessions}),
  reset: () => set(initialState),
}));

export default useSessionsState;

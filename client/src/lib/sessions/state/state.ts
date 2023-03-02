import {LiveSession} from '../../../../../shared/src/types/Session';
import {create} from 'zustand';
import {CompletedSessionsCount} from '../../../../../shared/src/types/CompletedSessions';

type State = {
  isLoading: boolean;
  sessions: LiveSession[] | null;
  completedSessionsCount: CompletedSessionsCount[] | null;
};

type Actions = {
  setIsLoading: (isLoading: State['isLoading']) => void;
  setSessions: (sessions: State['sessions']) => void;
  setCompletedSessionsCount: (
    completedSessionsCount: State['completedSessionsCount'],
  ) => void;
  reset: () => void;
};

const initialState: State = {
  isLoading: false,
  sessions: null,
  completedSessionsCount: null,
};

const useSessionsState = create<State & Actions>()(set => ({
  ...initialState,
  setIsLoading: isLoading => set({isLoading}),
  setSessions: sessions => set({sessions}),
  setCompletedSessionsCount: completedSessionsCount =>
    set({completedSessionsCount}),
  reset: () => set(initialState),
}));

export default useSessionsState;

import {Session, SessionState} from '../../../../../shared/src/types/Session';
import {create} from 'zustand';

type State = {
  session: Session | null;
  sessionState: SessionState | null;
  currentContentReachedEnd: boolean;
};

type Actions = {
  setPartialSessionState: (sessionState: Partial<SessionState>) => void;
  setSessionState: (sessionState: SessionState) => void;
  setSession: (session: Session) => void;
  setCurrentContentReachedEnd: (currentContentReachedEnd: boolean) => void;
  reset: () => void;
};

const initialState: State = {
  session: null,
  sessionState: null,
  currentContentReachedEnd: false,
};

const useSessionState = create<State & Actions>()((set, get) => ({
  ...initialState,
  setPartialSessionState: (sessionState: Partial<SessionState>) => {
    const existingState = get().sessionState;
    if (existingState) {
      set({sessionState: {...existingState, ...sessionState}});
    }
  },
  setSessionState: sessionState => set({sessionState}),
  setSession: session => set({session}),
  setCurrentContentReachedEnd: currentContentReachedEnd =>
    set({currentContentReachedEnd}),
  reset: () => set(initialState),
}));

export default useSessionState;

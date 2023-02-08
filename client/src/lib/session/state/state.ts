import {
  AsyncSession,
  LiveSession,
  SessionState,
} from '../../../../../shared/src/types/Session';
import {create} from 'zustand';
import {IconType} from '../../../lib/components/Icons';

export type Notification = {
  text: string;
  letter?: string;
  Icon?: IconType;
  image?: string;
  timeVisible?: number;
  visible?: boolean;
};

type State = {
  session: LiveSession | null;
  asyncSession: AsyncSession | null;
  sessionState: SessionState | null;
  currentContentReachedEnd: boolean;
  notifications: Notification[];
};

type Actions = {
  setPartialSessionState: (sessionState: Partial<SessionState>) => void;
  setSessionState: (sessionState: SessionState) => void;
  setSession: (session: LiveSession) => void;
  setAsyncSession: (asyncSession: AsyncSession) => void;
  setCurrentContentReachedEnd: (currentContentReachedEnd: boolean) => void;
  addNotification: (notification: Notification) => void;
  reset: () => void;
};

const initialState: State = {
  session: null,
  asyncSession: null,
  sessionState: null,
  currentContentReachedEnd: false,
  notifications: [],
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
  setSession: session => set({session, asyncSession: null}),
  setAsyncSession: asyncSession => set({asyncSession, session: null}),
  setCurrentContentReachedEnd: currentContentReachedEnd =>
    set({currentContentReachedEnd}),
  addNotification: notification =>
    set(state => ({notifications: [...state.notifications, notification]})),
  reset: () => set(initialState),
}));

export default useSessionState;

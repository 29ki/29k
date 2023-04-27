import {omit} from 'ramda';
import {create} from 'zustand';
import {
  AsyncSession,
  LiveSession,
  SessionState,
} from '../../../../../shared/src/schemas/Session';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
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
  liveSession: LiveSession | null;
  asyncSession: AsyncSession | null;
  sessionState: SessionState | null;
  exercise: Exercise | null;
  currentContentReachedEnd: boolean;
  notifications: Notification[];
};

type Actions = {
  setPartialSessionState: (sessionState: Partial<SessionState>) => void;
  setSessionState: (sessionState: SessionState) => void;
  setLiveSession: (liveSession: LiveSession) => void;
  setAsyncSession: (asyncSession: AsyncSession) => void;
  setExercise: (exercise: Exercise) => void;
  setCurrentContentReachedEnd: (currentContentReachedEnd: boolean) => void;
  addNotification: (notification: Notification) => void;
  reset: () => void;
};

const initialState: State = {
  liveSession: null,
  asyncSession: null,
  sessionState: null,
  exercise: null,
  currentContentReachedEnd: false,
  notifications: [],
};

const useSessionState = create<State & Actions>()((set, get) => ({
  ...initialState,
  setPartialSessionState: (sessionState: Partial<SessionState>) => {
    const existingState = get().sessionState;
    if (existingState) {
      const completed = existingState?.completed;
      const newSessionState = completed
        ? omit(['completed'], sessionState)
        : sessionState;
      set({sessionState: {...existingState, ...newSessionState}});
    }
  },
  setSessionState: sessionState => set({sessionState}),
  setLiveSession: liveSession => set({liveSession, asyncSession: null}),
  setAsyncSession: asyncSession => set({asyncSession, liveSession: null}),
  setExercise: exercise => set({exercise}),
  setCurrentContentReachedEnd: currentContentReachedEnd =>
    set({currentContentReachedEnd}),
  addNotification: notification =>
    set(state => ({notifications: [...state.notifications, notification]})),
  reset: () => set(initialState),
}));

export default useSessionState;

import {Session, SessionState} from '../../../../../shared/src/types/Session';
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
  session: Session | null;
  sessionState: SessionState | null;
  currentContentReachedEnd: boolean;
  notifications: Notification[];
};

type Actions = {
  setSessionState: (sessionState: SessionState) => void;
  setSession: (session: Session) => void;
  setCurrentContentReachedEnd: (currentContentReachedEnd: boolean) => void;
  addNotification: (notification: Notification) => void;
  reset: () => void;
};

const initialState: State = {
  session: null,
  sessionState: null,
  currentContentReachedEnd: false,
  notifications: [],
};

const useSessionState = create<State & Actions>()(set => ({
  ...initialState,
  setSessionState: sessionState => set({sessionState}),
  setSession: session => set({session}),
  setCurrentContentReachedEnd: currentContentReachedEnd =>
    set({currentContentReachedEnd}),
  addNotification: notification =>
    set(state => ({notifications: [...state.notifications, notification]})),
  reset: () => set(initialState),
}));

export default useSessionState;

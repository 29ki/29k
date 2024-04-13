import {omit} from 'ramda';
import {create} from 'zustand';
import {
  AsyncSessionType,
  LiveSessionType,
  SessionStateType,
} from '../../../../../shared/src/schemas/Session';
import {IconType} from '../../../lib/components/Icons';
import {ExerciseWithLanguage} from '../../content/types';

export type Notification = {
  text: string;
  letter?: string;
  Icon?: IconType;
  image?: string;
};

export type Reaction = {
  type: 'heart';
  name?: string;
};

type State = {
  mood: number | null;
  liveSession: LiveSessionType | null;
  asyncSession: AsyncSessionType | null;
  sessionState: SessionStateType | null;
  exercise: ExerciseWithLanguage | null;
  currentContentReachedEnd: boolean;
  notifications: Notification[];
  reactions: Reaction[];
};

type Actions = {
  setMood: (joinFeeling: number | null) => void;
  setPartialSessionState: (sessionState: Partial<SessionStateType>) => void;
  setSessionState: (sessionState: SessionStateType) => void;
  setLiveSession: (liveSession: LiveSessionType) => void;
  setAsyncSession: (asyncSession: AsyncSessionType) => void;
  setExercise: (exercise: ExerciseWithLanguage | null) => void;
  setCurrentContentReachedEnd: (currentContentReachedEnd: boolean) => void;
  addNotification: (notification: Notification) => void;
  addReaction: (reaction: Reaction) => void;
  reset: () => void;
};

const initialState: State = {
  mood: null,
  liveSession: null,
  asyncSession: null,
  sessionState: null,
  exercise: null,
  currentContentReachedEnd: false,
  notifications: [],
  reactions: [],
};

const useSessionState = create<State & Actions>()((set, get) => ({
  ...initialState,
  setMood: mood => set({mood}),
  setPartialSessionState: (sessionState: Partial<SessionStateType>) => {
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
  addReaction: reaction =>
    set(state => ({reactions: [...state.reactions, reaction]})),
  reset: () => set(initialState),
}));

export default useSessionState;

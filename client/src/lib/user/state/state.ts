import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createJSONStorage, persist} from 'zustand/middleware';
import {omit} from 'ramda';

import {Session} from '../../../../../shared/src/types/Session';
import migrate from './migration';
import {UserProfile} from '../../../../../shared/src/types/User';

const USER_STATE_VERSION = 3;

type PinnedSession = {
  id: string;
  expires: Date;
};

export type CompletedSession = {
  id: Session['id'];
  hostId?: Session['hostId'];
  exerciseId: Session['exerciseId'];
  language: Session['language'];
  type: Session['type'];
  mode: Session['mode'];
  completedAt: Date;
  hostProfile?: UserProfile;
};

export type PostPayload = {
  sessionId: string;
  exerciseId: string;
  sharingId: string;
  isPublic: boolean;
  isAnonymous: boolean;
  text: string;
};

export type FeedbackPayload = {
  like: boolean;
  text?: string;
};

export type Event = {
  type: 'post' | 'feedback';
  payload: PostPayload | FeedbackPayload;
  timestamp: Date;
};

export type UserState = {
  pinnedSessions?: Array<PinnedSession>;
  completedSessions?: Array<CompletedSession>;
  events?: Array<Event>;
  metricsUid?: string;
};

type SetCurrentUserState = (
  setter:
    | Partial<UserState>
    | ((userState: Partial<UserState>) => Partial<UserState>),
) => void;

export type State = {
  user: FirebaseAuthTypes.User | null;
  claims: FirebaseAuthTypes.IdTokenResult['claims'];
  userState: {[key: string]: UserState};
};

export type PersistedState = Pick<State, 'userState'>;

export type Actions = {
  setUser: (user: State['user']) => void;
  setClaims: (claims: State['claims']) => void;
  setUserAndClaims: (state: {
    user: State['user'];
    claims: State['claims'];
  }) => void;
  setPinnedSessions: (pinnedSessions: Array<PinnedSession>) => void;
  addCompletedSession: (completedSession: CompletedSession) => void;
  addEvent: (type: Event['type'], event: Event['payload']) => void;
  setCurrentUserState: SetCurrentUserState;
  reset: (isDelete?: boolean) => void;
};

const initialState: State = {
  user: null,
  claims: {},
  userState: {},
};

type GetCurrentUserStateSelector = (state: State) => UserState | undefined;
export const getCurrentUserStateSelector: GetCurrentUserStateSelector = ({
  user,
  userState,
}) => {
  if (user?.uid) {
    return userState[user.uid];
  }
};

type GetCompletedSessionByIdSelector = (
  state: State,
  sessionId: string,
) => CompletedSession | undefined;
export const getCompletedSessionByIdSelector: GetCompletedSessionByIdSelector =
  ({user, userState}, sessionId) => {
    if (user?.uid) {
      const state = userState[user.uid] as UserState | undefined;
      return state?.completedSessions?.find(cs => cs.id === sessionId);
    }
  };

const useUserState = create<State & Actions>()(
  persist(
    (set, get) => {
      const setCurrentUserState: SetCurrentUserState = setter => {
        const {user} = get();
        if (user?.uid) {
          const currentState = getCurrentUserStateSelector(get()) ?? {};
          const newState =
            typeof setter === 'function' ? setter(currentState) : setter;

          set(({userState}) => ({
            userState: {
              ...userState,
              [user.uid]: {
                ...currentState,
                ...newState,
              },
            },
          }));
        }
      };

      return {
        ...initialState,
        setUser: user => set({user}),
        setClaims: claims => set({claims}),
        setUserAndClaims: ({user, claims}) => set({user, claims}),

        setCurrentUserState,
        setPinnedSessions: pinnedSessions =>
          setCurrentUserState({pinnedSessions}),
        addCompletedSession: completedSession =>
          setCurrentUserState(({completedSessions = []} = {}) => ({
            completedSessions: [...completedSessions, completedSession],
          })),
        addEvent: (type, payload) => {
          setCurrentUserState(({events = []} = {}) => ({
            events: [...events, {type, payload, timestamp: new Date()}],
          }));
        },
        reset: isDelete => {
          const {user} = get();
          if (isDelete && user?.uid) {
            // Remove the state specific to the user on delete
            set(({userState}) => ({
              ...initialState,
              userState: omit([user.uid], userState),
            }));
          } else {
            // Keep persisted state in case of sign out
            set(({userState}) => ({...initialState, userState}));
          }
        },
      };
    },
    {
      name: 'userState',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({userState}): PersistedState => ({userState}),
      // In dev I had change this with the app closed (android)
      // otherwise the "migrate" functions does not run due to diff failure
      version: USER_STATE_VERSION,
      migrate,
    },
  ),
);

export default useUserState;

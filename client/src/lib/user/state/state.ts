import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createJSONStorage, persist} from 'zustand/middleware';
import {omit} from 'ramda';

type PinnedSession = {
  id: string;
  expires: Date;
};

type CompletedSession = {
  id: string;
  completedAt: Date;
};

type UserState = {
  pinnedSessions?: Array<PinnedSession>;
  completedSessions?: Array<CompletedSession>;
  metricsUid?: string;
};

type GetCurrentUserState = () => UserState | undefined;

type SetCurrentUserState = (
  setter:
    | Partial<UserState>
    | ((userState: Partial<UserState>) => Partial<UserState>),
) => void;

type State = {
  user: FirebaseAuthTypes.User | null;
  claims: FirebaseAuthTypes.IdTokenResult['claims'];
  userState: {[key: string]: UserState};
};

type Actions = {
  setUser: (user: State['user']) => void;
  setClaims: (claims: State['claims']) => void;
  setUserAndClaims: (state: {
    user: State['user'];
    claims: State['claims'];
  }) => void;
  setPinnedSessions: (pinnedSessions: Array<PinnedSession>) => void;
  addCompletedSession: (completedSession: CompletedSession) => void;
  getCurrentUserState: GetCurrentUserState;
  setCurrentUserState: SetCurrentUserState;
  reset: (isDelete?: boolean) => void;
};

const initialState: State = {
  user: null,
  claims: {},
  userState: {},
};

const useUserState = create<State & Actions>()(
  persist(
    (set, get) => {
      const getCurrentUserState: GetCurrentUserState = () => {
        const {user, userState} = get();
        if (user?.uid) {
          return userState[user.uid];
        }
      };

      const setCurrentUserState: SetCurrentUserState = setter => {
        const {user} = get();
        if (user?.uid) {
          const state = getCurrentUserState() ?? {};
          const newState =
            typeof setter === 'function' ? setter(state) : setter;

          set(({userState}) => ({
            userState: {
              ...userState,
              [user.uid]: {
                ...state,
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

        getCurrentUserState,
        setCurrentUserState,
        setPinnedSessions: pinnedSessions =>
          setCurrentUserState({pinnedSessions}),
        addCompletedSession: completedSession =>
          setCurrentUserState(({completedSessions = []}) => ({
            completedSessions: [...completedSessions, completedSession],
          })),

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
      partialize: ({userState}) => ({userState}),
    },
  ),
);

export default useUserState;

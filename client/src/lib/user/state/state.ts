import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createJSONStorage, persist} from 'zustand/middleware';
import {lensPath, omit, set as lensSet} from 'ramda';

type PinnedSession = {
  id: string;
  expires: Date;
};

type CompletedSession = {
  id: string;
};

type UserState = {
  pinnedSessions: Array<PinnedSession>;
  completedSessions: Array<CompletedSession>;
};

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
  reset: (isDelete?: boolean) => void;
};

const initialState: State = {
  user: null,
  claims: {},
  userState: {},
};

const userStateLens = (uid: string, prop: keyof UserState) =>
  lensPath([uid, prop]);

const useUserState = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setUser: user => set({user}),
      setClaims: claims => set({claims}),
      setUserAndClaims: ({user, claims}) => set({user, claims}),
      setPinnedSessions: pinnedSessions => {
        const user = get().user;
        const userState = get().userState;
        if (user) {
          set({
            userState: lensSet(
              userStateLens(user.uid, 'pinnedSessions'),
              pinnedSessions,
              userState,
            ),
          });
        }
      },
      addCompletedSession: completedSession => {
        const user = get().user;
        const userState = get().userState;

        if (user) {
          set({
            userState: lensSet(
              userStateLens(user.uid, 'completedSessions'),
              [
                ...(userState[user.uid]?.completedSessions || []),
                completedSession,
              ],
              userState,
            ),
          });
        }
      },
      reset: isDelete => {
        const user = get().user;
        const userState = get().userState;
        if (isDelete && user) {
          // Remove the state specific to the user on delete
          set({...initialState, userState: omit([user.uid], userState)});
        } else {
          // Keep persisted state in case of sign out
          set({...initialState, userState});
        }
      },
    }),
    {
      name: 'userState',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({userState}) => ({userState}),
    },
  ),
);

export default useUserState;

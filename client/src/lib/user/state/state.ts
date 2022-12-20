import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persist} from 'zustand/middleware';
import {lensPath, set as lensSet} from 'ramda';

const pinnedSessionLens = (uid: string) => lensPath([uid, 'pinnedSessions']);

type PinnedSession = {
  id: string;
  expires: Date;
};

type State = {
  user: FirebaseAuthTypes.User | null;
  claims: FirebaseAuthTypes.IdTokenResult['claims'];
  userState: {
    [key: string]: {pinnedSessions: Array<PinnedSession>};
  };
};

type Actions = {
  setUser: (user: State['user']) => void;
  setClaims: (claims: State['claims']) => void;
  setUserAndClaims: (state: {
    user: State['user'];
    claims: State['claims'];
  }) => void;
  setPinnedSessions: (pinnedSessions: Array<PinnedSession>) => void;
  reset: () => void;
};

const initialState: State = {
  user: null,
  claims: {},
  userState: {},
};

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
              pinnedSessionLens(user.uid),
              pinnedSessions,
              userState,
            ),
          });
        }
      },
      reset: () => set(initialState),
    }),
    {
      name: 'userState',
      getStorage: () => AsyncStorage,
      partialize: ({userState}) => ({userState}),
    },
  ),
);

export default useUserState;

import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import create from 'zustand';

type State = {
  user: FirebaseAuthTypes.User | null;
  claims: FirebaseAuthTypes.IdTokenResult['claims'];
};

type Actions = {
  setUser: (user: State['user']) => void;
  setClaims: (claims: State['claims']) => void;
  setUserAndClaims: (state: {
    user: State['user'];
    claims: State['claims'];
  }) => void;
  reset: () => void;
};

const initialState: State = {
  user: null,
  claims: {},
};

const useUserState = create<State & Actions>()(set => ({
  ...initialState,
  setUser: user => set({user}),
  setClaims: claims => set({claims}),
  setUserAndClaims: ({user, claims}) => set({user, claims}),
  reset: () => set(initialState),
}));

export default useUserState;

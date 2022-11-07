import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import create from 'zustand';

type State = {
  user: FirebaseAuthTypes.User | null;
};

type Actions = {
  setUser: (user: State['user']) => void;
  reset: () => void;
};

const initialState: State = {
  user: null,
};

const useUserState = create<State & Actions>()(set => ({
  ...initialState,
  setUser: user => set({user}),
  reset: () => set(initialState),
}));

export default useUserState;

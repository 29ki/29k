import {create} from 'zustand';

type State = {
  navigateWithFade: boolean;
};

type Actions = {
  setNavigateWithFade: (navigateWithFade: State['navigateWithFade']) => void;
};

const initialState: State = {
  navigateWithFade: false,
};

const useNavigationState = create<State & Actions>()(set => ({
  ...initialState,
  setNavigateWithFade: navigateWithFade => set({navigateWithFade}),
}));

export default useNavigationState;

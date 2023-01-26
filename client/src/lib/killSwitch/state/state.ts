import {create} from 'zustand';

type State = {
  isBlocking: boolean;
  isLoading: boolean;
  requiresBundleUpdate: boolean;
  isRetriable: boolean;
  hasFailed: boolean;
  message?: {
    image?: string | null;
    message?: string | null;
    button?: {
      link: string;
      text: string;
    } | null;
  };
};

type Actions = {
  setState: (state: Partial<State>) => void;
  setRequiresBundleUpdate: (requiresBundleUpdate: boolean) => void;
  reset: () => void;
};

const initialState: State = {
  isBlocking: false,
  isLoading: false,
  hasFailed: false,
  isRetriable: false,
  requiresBundleUpdate: false,
};

const useKillSwitchState = create<State & Actions>()(set => ({
  ...initialState,
  setState: toggles => set(toggles),
  setRequiresBundleUpdate: requiresBundleUpdate => set({requiresBundleUpdate}),
  reset: () => set(initialState),
}));

export default useKillSwitchState;

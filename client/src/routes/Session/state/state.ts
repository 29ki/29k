import {Session} from '../../../../../shared/src/types/Session';
import create from 'zustand';

type State = {
  session: Session | null;
  isLoadingContent: boolean;
};

type Actions = {
  setState: (session: Session) => void;
  setIsLoadingContent: (loading: boolean) => void;
  reset: () => void;
};

const initialState = {
  session: null,
  isLoadingContent: false,
};

const useSessionState = create<State & Actions>()(set => ({
  ...initialState,
  setState: session => set({session}),
  setIsLoadingContent: loading => set({isLoadingContent: loading}),
  reset: () => set(initialState),
}));

export default useSessionState;

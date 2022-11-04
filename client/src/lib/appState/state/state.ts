import create from 'zustand';

type State = {
  isColdStarted: boolean;
};

type Actions = {
  setIsColdStarted: (isColdStarted: boolean) => void;
};

const useAppState = create<State & Actions>()(set => ({
  isColdStarted: true,
  setIsColdStarted: isColdStarted => set({isColdStarted}),
}));

export default useAppState;

import create from 'zustand';

type State = {
  isColdStarted: boolean;
  isFirstLaunch: boolean;
};

type Actions = {
  setIsColdStarted: (isColdStarted: boolean) => void;
  setIsFirstLaunch: (isFirstLaunch: boolean) => void;
};

const useAppState = create<State & Actions>()(set => ({
  isColdStarted: true,
  isFirstLaunch: false,
  setIsColdStarted: isColdStarted => set({isColdStarted}),
  setIsFirstLaunch: isFirstLaunch => set({isFirstLaunch}),
}));

export default useAppState;

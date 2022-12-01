import create from 'zustand';

type State = {
  isColdStarted: boolean;
  isFirstLaunch: boolean;
  showNonPublishedContent: boolean;
};

type Actions = {
  setIsColdStarted: (isColdStarted: boolean) => void;
  setIsFirstLaunch: (isFirstLaunch: boolean) => void;
  setShowNonPublishedContent: (showNonPublishedContent: boolean) => void;
};

const useAppState = create<State & Actions>()(set => ({
  isColdStarted: true,
  isFirstLaunch: false,
  showNonPublishedContent: false,
  setIsColdStarted: isColdStarted => set({isColdStarted}),
  setIsFirstLaunch: isFirstLaunch => set({isFirstLaunch}),
  setShowNonPublishedContent: showNonPublishedContent =>
    set({showNonPublishedContent}),
}));

export default useAppState;

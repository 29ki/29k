import create from 'zustand';

type AppState = {
  isColdStarted: boolean;
  setIsColdStarted: (isColdStarted: boolean) => void;
};
const useAppState = create<AppState>()(set => ({
  isColdStarted: true,
  setIsColdStarted: isColdStarted => set({isColdStarted}),
}));

export default useAppState;

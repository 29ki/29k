import create from 'zustand';
import {persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {LANGUAGE_TAG} from '../../i18n';

export type Settings = {
  showWelcome: boolean;
  preferredLanguage?: LANGUAGE_TAG;
};

type State = {
  isColdStarted: boolean;
  settings: Settings;
};

type Actions = {
  setIsColdStarted: (isColdStarted: boolean) => void;
  setSettings: (settings: Partial<State['settings']>) => void;
};

const initialState: State = {
  isColdStarted: true,
  settings: {
    showWelcome: true,
  },
};

const useAppState = create<State & Actions>()(
  persist(
    set => ({
      ...initialState,
      setIsColdStarted: isColdStarted => set({isColdStarted}),
      setSettings: settings =>
        set(state => ({settings: {...state.settings, ...settings}})),
    }),
    {
      name: 'appState',
      getStorage: () => AsyncStorage,
      partialize: ({settings}) => ({settings}),
    },
  ),
);

export default useAppState;

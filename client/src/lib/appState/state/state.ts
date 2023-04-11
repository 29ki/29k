import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {LANGUAGE_TAG} from '../../i18n';

export const APP_RATING_REVISION = 1;

export type Settings = {
  showWelcome: boolean;
  preferredLanguage?: LANGUAGE_TAG;
  showHiddenContent: boolean;
  appRatedRevision?: number;
};

type State = {
  isColdStarted: boolean;
  settings: Settings;
};

type Actions = {
  setIsColdStarted: (isColdStarted: boolean) => void;
  setSettings: (settings: Partial<State['settings']>) => void;
  reset: () => void;
};

const initialState: State = {
  isColdStarted: true,
  settings: {
    showHiddenContent: false,
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
      reset: () => set(initialState),
    }),
    {
      name: 'appState',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({settings}) => ({
        settings,
      }),
    },
  ),
);

export default useAppState;

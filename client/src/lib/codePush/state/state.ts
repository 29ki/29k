import CodePush from 'react-native-code-push';
import {create} from 'zustand';

type State = {
  status: CodePush.SyncStatus;
  updateAvailable: boolean;
  downloadProgress: number;
};

type Actions = {
  setStatus: (status: State['status']) => void;
  setUpdateAvailable: (updateAvailable: State['updateAvailable']) => void;
  setDownloadProgress: (progress: State['downloadProgress']) => void;
  reset: () => void;
};

const initialState: State = {
  status: CodePush.SyncStatus.UP_TO_DATE,
  updateAvailable: false,
  downloadProgress: 0,
};

const useCodePushState = create<State & Actions>()(set => ({
  ...initialState,
  setStatus: status => set({status}),
  setUpdateAvailable: updateAvailable => set({updateAvailable}),
  setDownloadProgress: downloadProgress => set({downloadProgress}),
  reset: () => set(initialState),
}));

export default useCodePushState;

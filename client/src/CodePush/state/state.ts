import CodePush from 'react-native-code-push';
import {atom} from 'recoil';

const ROOT_KEY = 'CodePush';

export const downloadProgressAtom = atom({
  key: `${ROOT_KEY}/DownloadProgress`,
  default: 0,
});

export const isColdStartedAtom = atom({
  key: `${ROOT_KEY}/IsColdStarted`,
  default: true,
});

export const statusAtom = atom({
  key: `${ROOT_KEY}/Status`,
  default: CodePush.SyncStatus.UP_TO_DATE,
});

export const updateAvailableAtom = atom({
  key: `${ROOT_KEY}/UpdateAvailable`,
  default: false,
});

import CodePush from 'react-native-code-push';
import {atom} from 'recoil';

export const NAMESPACE = 'CodePush';

export const downloadProgressAtom = atom({
  key: `${NAMESPACE}/DownloadProgress`,
  default: 0,
});

export const statusAtom = atom({
  key: `${NAMESPACE}/Status`,
  default: CodePush.SyncStatus.UP_TO_DATE,
});

export const updateAvailableAtom = atom({
  key: `${NAMESPACE}/UpdateAvailable`,
  default: false,
});

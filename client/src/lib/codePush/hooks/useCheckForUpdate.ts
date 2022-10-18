import {useCallback} from 'react';
import {Platform} from 'react-native';
import codePush, {DownloadProgress} from 'react-native-code-push';
import {
  IOS_CODE_PUSH_DEPLOYMENT_KEY,
  ANDROID_CODE_PUSH_DEPLOYMENT_KEY,
} from 'config';
import {useSetRecoilState} from 'recoil';
import {
  downloadProgressAtom,
  statusAtom,
  updateAvailableAtom,
} from '../state/state';

const deploymentKey = Platform.select({
  android: ANDROID_CODE_PUSH_DEPLOYMENT_KEY,
  ios: IOS_CODE_PUSH_DEPLOYMENT_KEY,
});

const {
  CHECKING_FOR_UPDATE,
  DOWNLOADING_PACKAGE,
  INSTALLING_UPDATE,
  UP_TO_DATE,
  UPDATE_INSTALLED,
} = codePush.SyncStatus;

const logStatus = (status: codePush.SyncStatus) => {
  switch (status) {
    case CHECKING_FOR_UPDATE:
      console.log('[CodePush] Checking for updates');
      break;
    case DOWNLOADING_PACKAGE:
      console.log('[CodePush] Downloading package');
      break;
    case INSTALLING_UPDATE:
      console.log('[CodePush] Installing update');
      break;
    case UP_TO_DATE:
      console.log('[CodePush] Up-to-date');
      break;
    case UPDATE_INSTALLED:
      console.log('[CodePush] Update installed');
      break;
    default:
      break;
  }
};

const useCheckForUpdate = () => {
  const setStatus = useSetRecoilState(statusAtom);
  const setUpdateAvailable = useSetRecoilState(updateAvailableAtom);
  const setDownloadProgress = useSetRecoilState(downloadProgressAtom);

  const onStatus = useCallback(
    (status: codePush.SyncStatus) => {
      setStatus(status);
      logStatus(status);
      setUpdateAvailable(status === UPDATE_INSTALLED);
    },
    [setStatus, setUpdateAvailable],
  );

  const onProgress = useCallback(
    (progress: DownloadProgress) => {
      setDownloadProgress(progress.receivedBytes / progress.totalBytes);
    },
    [setDownloadProgress],
  );

  return useCallback(async () => {
    try {
      if (deploymentKey) {
        await codePush.sync(
          {
            mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESTART,
            deploymentKey,
          },
          onStatus,
          onProgress,
        );
      }
    } catch (cause) {
      throw new Error('Code Push check failed', {cause});
    }
  }, [onStatus, onProgress]);
};

export default useCheckForUpdate;

import React, {createContext, useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import codePush from 'react-native-code-push';
import {
  IOS_CODE_PUSH_DEPLOYMENT_KEY,
  ANDROID_CODE_PUSH_DEPLOYMENT_KEY,
} from 'config';
import useResumeFromBackgrounded from '../hooks/useResumeFromBackgrounded';

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

type CodePushContextType = {
  checkForUpdate: () => Promise<void>;
  clearUpdates: () => void;
  downloadProgress: number;
  isColdStarted: boolean;
  restartApp: () => void;
  status: null | codePush.SyncStatus;
  updateAvailable: boolean;
};

const defaultState = {
  checkForUpdate: () => Promise.resolve(),
  clearUpdates: () => undefined,
  downloadProgress: 0,
  isColdStarted: false,
  restartApp: () => undefined,
  status: null,
  updateAvailable: false,
};

export const CodePushContext = createContext<CodePushContextType>(defaultState);

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

const CodePushProvider: React.FC = ({children}) => {
  const [status, setStatus] = useState(UP_TO_DATE);
  const [isColdStarted, setIsColdStarted] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const updateAvailable = status === UPDATE_INSTALLED;

  const restartApp = useCallback(() => codePush.restartApp(), []);
  const clearUpdates = useCallback(() => codePush.clearUpdates(), []);
  const checkForUpdate = useCallback(async () => {
    try {
      await codePush.sync(
        {
          mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESTART,
          deploymentKey,
        },
        setStatus,
        progress => {
          setDownloadProgress(progress.receivedBytes / progress.totalBytes);
        },
      );
    } catch (cause) {
      console.error(new Error(`Code Push check failed ${cause}`));
    }
  }, []);

  // Log status updates
  useEffect(() => {
    logStatus(status);
  }, [status]);

  // Check for update on mount
  useEffect(() => {
    checkForUpdate();
  }, [checkForUpdate]);

  // Check for updates when resuming from background
  useResumeFromBackgrounded(() => {
    setIsColdStarted(false);
    checkForUpdate();
  });

  return (
    <CodePushContext.Provider
      value={{
        checkForUpdate,
        clearUpdates,
        downloadProgress,
        isColdStarted,
        restartApp,
        status,
        updateAvailable,
      }}>
      {children}
    </CodePushContext.Provider>
  );
};

export default codePush({
  checkFrequency: codePush.CheckFrequency.MANUAL,
})(CodePushProvider);

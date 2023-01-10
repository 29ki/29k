import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import codePush from 'react-native-code-push';
import {GIT_COMMIT_SHORT} from 'config';

export const getBundleVersion = async () => {
  const update = await codePush.getUpdateMetadata();
  if (update && 'label' in update) {
    return parseInt(update.label.replace(/[^\d]*/, ''), 10);
  }
};

export type DeviceInfo = {
  os: string;
  osVersion: string | number;
  nativeVersion: string;
  bundleVersion: number | undefined;
  gitCommit: string;
};

export const getDeviceInfo = async () => ({
  model: DeviceInfo.getModel(),
  os: Platform.OS,
  osVersion: Platform.Version,
  nativeVersion: DeviceInfo.getVersion(),
  bundleVersion: await getBundleVersion(),
  gitCommit: GIT_COMMIT_SHORT,
});

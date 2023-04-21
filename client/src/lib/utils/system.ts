import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {GIT_COMMIT_SHORT} from 'config';
import getBundleVersion from '../codePush/components/utils/getBundleVersion';

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

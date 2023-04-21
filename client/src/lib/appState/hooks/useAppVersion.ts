import {useCallback, useEffect, useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import getBundleVersion from '../../codePush/components/utils/getBundleVersion';
import {ENVIRONMENT, GIT_COMMIT_SHORT} from 'config';

const useAppVersion = () => {
  const [bundleVersion, setBundleVersion] = useState<number | undefined>();
  const [nativeVersion, setNativeVersion] = useState<string | undefined>();

  const setVersions = useCallback(async () => {
    setNativeVersion(DeviceInfo.getVersion());
    setBundleVersion(await getBundleVersion());
  }, []);

  useEffect(() => {
    setVersions();
  }, [setVersions]);

  const env = ENVIRONMENT.charAt(0).toUpperCase();
  const gitCommit = GIT_COMMIT_SHORT ? `@${GIT_COMMIT_SHORT}` : '';
  const bundle = bundleVersion ? `-v${bundleVersion}` : '';

  return `${nativeVersion}${bundle}/${env}${gitCommit}`;
};

export default useAppVersion;

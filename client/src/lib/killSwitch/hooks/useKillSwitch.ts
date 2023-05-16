import debug from 'debug';
import {useCallback} from 'react';
import {DeviceInfo, getDeviceInfo} from '../../utils/system';
import apiClient from '../../apiClient/apiClient';
import useKillSwitchState from '../state/state';

const logDebug = debug('client:killSwitch');

type KillSwitchReponseBody = {
  requiresBundleUpdate?: boolean;
  permanent?: boolean;
  image?: string;
  message?: string;
  button?: {
    link: string;
    text: string;
  } | null;
};

const getKillSwitchUrl = ({
  os,
  osVersion,
  nativeVersion,
  bundleVersion,
}: DeviceInfo) =>
  '/killSwitch?' +
  [
    `platform=${os}`,
    `platformVersion=${osVersion}`,
    `version=${nativeVersion}`,
    `bundleVersion=${bundleVersion ?? ''}`,
  ].join('&');

const useKillSwitch = () => {
  const reset = useKillSwitchState(state => state.reset);
  const setState = useKillSwitchState(state => state.setState);

  const fetchKillSwitch = useCallback(
    async (url: string) => {
      setState({isLoading: true});

      try {
        return await apiClient(url, undefined, false);
      } catch (cause: any) {
        // Do not block the user on network issues
        setState({
          isBlocking: cause.message !== 'Network request failed',
          isRetriable: true,
          hasFailed: true,
        });
        throw new Error('Kill Switch failed', {cause});
      } finally {
        setState({isLoading: false});
      }
    },
    [setState],
  );

  const getResponseData = useCallback(
    async (response: Response) => {
      try {
        const body = await response.text();

        if (body) {
          return JSON.parse(body);
        }

        return {};
      } catch (cause) {
        setState({
          isBlocking: true,
          isRetriable: true,
          hasFailed: true,
        });

        throw new Error('Failed to read Kill Switch body', {cause});
      }
    },
    [setState],
  );

  const checkKillSwitch = useCallback(async () => {
    reset();

    const {os, osVersion, nativeVersion, bundleVersion, gitCommit} =
      await getDeviceInfo();

    const url = getKillSwitchUrl({
      os,
      osVersion,
      nativeVersion,
      bundleVersion,
      gitCommit,
    });

    logDebug(`checking status @ ${os}${osVersion}@${nativeVersion}`);
    const response = await fetchKillSwitch(url);

    const data = await getResponseData(response);

    const {image, message, button, requiresBundleUpdate, permanent} =
      data as KillSwitchReponseBody;

    if (requiresBundleUpdate) {
      logDebug(`requires bundle update @ ${os}${osVersion}@${nativeVersion}`);
      setState({requiresBundleUpdate: true});
    }

    if (response.ok) {
      logDebug(`ok @ ${os}${osVersion}@${nativeVersion}`);
      setState({isBlocking: false});
      return;
    }

    logDebug(`not ok @ ${os}${osVersion}@${nativeVersion}`);

    setState({
      isBlocking: true,
      isRetriable: !permanent,
      message: {
        image,
        message,
        button,
      },
    });

    throw new Error(`${os}${osVersion}@${nativeVersion} is Kill Switched`);
  }, [fetchKillSwitch, getResponseData, reset, setState]);

  return checkKillSwitch;
};

export default useKillSwitch;

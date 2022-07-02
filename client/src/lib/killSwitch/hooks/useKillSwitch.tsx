import {KILL_SWITCH_ENDPOINT} from 'config';
import {useResetRecoilState, useSetRecoilState} from 'recoil';
import {DeviceInfo, getDeviceInfo} from '../../../common/utils/system';
import {
  killSwitchAtom,
  killSwitchFields,
  killSwitchMessageAtom,
} from '../state/state';

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
  languageCode,
}: DeviceInfo & {languageCode: string}) =>
  KILL_SWITCH_ENDPOINT +
  '?' +
  [
    `platform=${os}`,
    `platformVersion=${osVersion}`,
    `version=${nativeVersion}`,
    `bundleVersion=${bundleVersion}`,
    `language=${languageCode}`,
  ].join('&');

const useKillSwitch = () => {
  const reset = useResetRecoilState(killSwitchAtom);

  const setIsLoading = useSetRecoilState(killSwitchFields('isLoading'));
  const setIsBlocking = useSetRecoilState(killSwitchFields('isBlocking'));
  const setHasFailed = useSetRecoilState(killSwitchFields('hasFailed'));
  const setIsRetriable = useSetRecoilState(killSwitchFields('isRetriable'));
  const setRequiresBundleUpdate = useSetRecoilState(
    killSwitchFields('requiresBundleUpdate'),
  );
  const setMessage = useSetRecoilState(killSwitchMessageAtom);

  const fetchKillSwitch = async (url: string) => {
    setIsLoading(true);

    try {
      return await fetch(url);
    } catch (cause: any) {
      if (cause.message === 'Network request failed') {
        // Do not block the user on network issues
        setIsBlocking(false);
      }

      setIsRetriable(true);
      setHasFailed(true);
      throw new Error('Kill Switch failed', {cause});
    } finally {
      setIsLoading(false);
    }
  };

  const getResponseData = async (response: Response) => {
    try {
      const body = await response.text();

      if (body) {
        return JSON.parse(body);
      }

      return {};
    } catch (cause) {
      setIsBlocking(true);
      setIsRetriable(true);
      setHasFailed(true);

      throw new Error('Failed to read Kill Switch body', {cause});
    }
  };

  const checkKillSwitch = async () => {
    reset();

    const {os, osVersion, nativeVersion, bundleVersion} = await getDeviceInfo();
    const languageCode = 'en'; //getCurrentLanguageCode();

    const url = getKillSwitchUrl({
      os,
      osVersion,
      nativeVersion,
      bundleVersion,
      languageCode,
    });

    const response = await fetchKillSwitch(url);

    const data = await getResponseData(response);

    const {image, message, button, requiresBundleUpdate, permanent} =
      data as KillSwitchReponseBody;

    setRequiresBundleUpdate(Boolean(requiresBundleUpdate));

    if (response.ok) {
      setIsBlocking(false);
      return;
    }

    setIsBlocking(true);

    setIsRetriable(!permanent);

    setMessage({
      image,
      message,
      button,
    });

    throw new Error(`${os}${osVersion}@${nativeVersion} is Kill Switched`);
  };

  return checkKillSwitch;
};

export default useKillSwitch;

import {KILL_SWITCH_ENDPOINT} from 'config';
import {useResetRecoilState, useSetRecoilState} from 'recoil';
import {DeviceInfo, getDeviceInfo} from '../../../common/utils/system';
import {killSwitchAtom, killSwitchFields} from '../state/state';

type KillSwitchReponseBody = {
  image?: string;
  message?: string;
  button?: string;
  requiresBundleUpdate?: boolean;
  permanent?: boolean;
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
  const setIsRetriable = useSetRecoilState(killSwitchFields('isRetriable'));
  const setHasFailed = useSetRecoilState(killSwitchFields('hasFailed'));
  const setRequireBundleUpdate = useSetRecoilState(
    killSwitchFields('requireBundleUpdate'),
  );
  const setImage = useSetRecoilState(killSwitchFields('image'));
  const setMessage = useSetRecoilState(killSwitchFields('message'));
  const setButton = useSetRecoilState(killSwitchFields('button'));
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

  return async () => {
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

    setRequireBundleUpdate(Boolean(requiresBundleUpdate));

    if (response.ok) {
      setIsBlocking(false);
      return;
    }

    setIsBlocking(true);

    setIsRetriable(!Boolean(permanent));

    if (image) {
      setImage(image);
    }

    if (message) {
      setMessage(message);
    }

    if (button) {
      setButton(button);
    }

    throw new Error(`${os}${osVersion}@${nativeVersion} is Kill Switched`);
  };
};

export default useKillSwitch;

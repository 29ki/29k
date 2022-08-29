import {API_ENDPOINT} from 'config';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
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
  API_ENDPOINT +
  '/killSwitch?' +
  [
    `platform=${os}`,
    `platformVersion=${osVersion}`,
    `version=${nativeVersion}`,
    `bundleVersion=${bundleVersion}`,
    `language=${languageCode}`,
  ].join('&');

const useKillSwitch = () => {
  const {i18n} = useTranslation();

  const reset = useResetRecoilState(killSwitchAtom);

  const setIsLoading = useSetRecoilState(killSwitchFields('isLoading'));
  const setIsBlocking = useSetRecoilState(killSwitchFields('isBlocking'));
  const setHasFailed = useSetRecoilState(killSwitchFields('hasFailed'));
  const setIsRetriable = useSetRecoilState(killSwitchFields('isRetriable'));
  const setRequiresBundleUpdate = useSetRecoilState(
    killSwitchFields('requiresBundleUpdate'),
  );
  const setMessage = useSetRecoilState(killSwitchMessageAtom);

  const fetchKillSwitch = useCallback(
    async (url: string) => {
      setIsLoading(true);

      try {
        return await fetch(url);
      } catch (cause: any) {
        // Do not block the user on network issues
        setIsBlocking(cause.message !== 'Network request failed');
        setIsRetriable(true);
        setHasFailed(true);
        throw new Error('Kill Switch failed', {cause});
      } finally {
        setIsLoading(false);
      }
    },
    [setHasFailed, setIsBlocking, setIsRetriable, setIsLoading],
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
        setIsBlocking(true);
        setIsRetriable(true);
        setHasFailed(true);

        throw new Error('Failed to read Kill Switch body', {cause});
      }
    },
    [setIsBlocking, setIsRetriable, setHasFailed],
  );

  const checkKillSwitch = useCallback(async () => {
    reset();

    const {os, osVersion, nativeVersion, bundleVersion, gitCommit} =
      await getDeviceInfo();
    const languageCode = i18n.resolvedLanguage;

    const url = getKillSwitchUrl({
      os,
      osVersion,
      nativeVersion,
      bundleVersion,
      gitCommit,
      languageCode,
    });

    console.log(
      `[KillSwitch] checking status @ ${os}${osVersion}@${nativeVersion}`,
    );
    const response = await fetchKillSwitch(url);

    const data = await getResponseData(response);

    const {image, message, button, requiresBundleUpdate, permanent} =
      data as KillSwitchReponseBody;

    if (requiresBundleUpdate) {
      console.log(
        `[KillSwitch] requires bundle update @ ${os}${osVersion}@${nativeVersion}`,
      );
      setRequiresBundleUpdate(true);
    }

    if (response.ok) {
      console.log(`[KillSwitch] ok @ ${os}${osVersion}@${nativeVersion}`);
      setIsBlocking(false);
      return;
    }

    console.log(`[KillSwitch] not ok @ ${os}${osVersion}@${nativeVersion}`);

    setIsBlocking(true);

    setIsRetriable(!permanent);

    setMessage({
      image,
      message,
      button,
    });

    throw new Error(`${os}${osVersion}@${nativeVersion} is Kill Switched`);
  }, [
    fetchKillSwitch,
    getResponseData,
    reset,
    setIsBlocking,
    setIsRetriable,
    setRequiresBundleUpdate,
    setMessage,
    i18n.resolvedLanguage,
  ]);

  return checkKillSwitch;
};

export default useKillSwitch;

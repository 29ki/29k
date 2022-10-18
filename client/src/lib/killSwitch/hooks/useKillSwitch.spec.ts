import {renderHook, act} from '@testing-library/react-hooks';
import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';
import {RecoilRoot, useRecoilValue} from 'recoil';
import {killSwitchAtom, killSwitchMessageAtom} from '../state/state';

import useKillSwitch from './useKillSwitch';

enableFetchMocks();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      resolvedLanguage: 'some-language',
    },
  }),
}));

beforeEach(() => {
  fetchMock.resetMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('useKillSwitch', () => {
  const useTestHook = () => {
    const checkKillSwitch = useKillSwitch();
    const killSwitchState = useRecoilValue(killSwitchAtom);
    const killSwitchMessageState = useRecoilValue(killSwitchMessageAtom);

    return {checkKillSwitch, killSwitchState, killSwitchMessageState};
  };

  describe('Success', () => {
    it('checks if the app is killed', async () => {
      fetchMock.mockResponseOnce('', {status: 200});

      const {result} = renderHook(useTestHook, {wrapper: RecoilRoot});

      await act(() => result.current.checkKillSwitch());

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        'some-api-endpoint/killSwitch?platform=some-os&platformVersion=some-os-version&version=some-version&bundleVersion=1337&language=some-language',
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Correlation-ID': expect.any(String),
          },
        },
      );
    });

    it('sets isBlocking=true if server says no', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}), {status: 403});

      const {result} = renderHook(useTestHook, {wrapper: RecoilRoot});

      expect(result.current.killSwitchState).toEqual({
        hasFailed: false,
        isBlocking: false,
        isLoading: false,
        isRetriable: false,
        requiresBundleUpdate: false,
      });

      await act(async () => {
        await expect(result.current.checkKillSwitch()).rejects.toThrow(
          new Error('some-ossome-os-version@some-version is Kill Switched'),
        );
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);

      expect(result.current.killSwitchState).toEqual({
        hasFailed: false,
        isBlocking: true,
        isLoading: false,
        isRetriable: true,
        requiresBundleUpdate: false,
      });
      /*
      expect(metrics.logEvent).toHaveBeenCalledTimes(1);
      expect(metrics.logEvent).toHaveBeenCalledWith('Show Kill Switch', {
        bundleVersion: 1337,
        language: 'en',
        platform: 'some-os',
        platformVersion: 'some-os-version',
        version: 'some-version',
      });
      */
    });

    it('sets isRetriable=false if permanent', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          permanent: true,
        }),
        {status: 403},
      );

      const {result} = renderHook(useTestHook, {wrapper: RecoilRoot});

      expect(result.current.killSwitchState).toEqual({
        hasFailed: false,
        isBlocking: false,
        isLoading: false,
        isRetriable: false,
        requiresBundleUpdate: false,
      });

      await act(async () => {
        await expect(result.current.checkKillSwitch()).rejects.toThrow(
          new Error('some-ossome-os-version@some-version is Kill Switched'),
        );
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);

      expect(result.current.killSwitchState).toEqual({
        hasFailed: false,
        isBlocking: true,
        isLoading: false,
        isRetriable: false,
        requiresBundleUpdate: false,
      });
    });

    it('sets image, message and button if provided by server', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          image: 'http://some/image.jpg',
          message: 'Some Message',
          button: {
            text: 'Some Button Text',
            link: 'http://some.link',
          },
        }),
        {status: 403},
      );

      const {result} = renderHook(useTestHook, {wrapper: RecoilRoot});

      expect(result.current.killSwitchMessageState).toEqual({
        button: null,
        image: null,
        message: null,
      });

      await act(async () => {
        await expect(result.current.checkKillSwitch()).rejects.toThrow(
          new Error('some-ossome-os-version@some-version is Kill Switched'),
        );
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);

      expect(result.current.killSwitchMessageState).toEqual({
        image: 'http://some/image.jpg',
        message: 'Some Message',
        button: {
          text: 'Some Button Text',
          link: 'http://some.link',
        },
      });
    });

    it('sets requiresBundleUpdate=true if server says so', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          requiresBundleUpdate: true,
        }),
        {status: 200},
      );

      const {result} = renderHook(useTestHook, {wrapper: RecoilRoot});

      expect(result.current.killSwitchState).toEqual({
        hasFailed: false,
        isBlocking: false,
        isLoading: false,
        isRetriable: false,
        requiresBundleUpdate: false,
      });

      await act(async () => {
        await expect(result.current.checkKillSwitch()).resolves.toBe(undefined);
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);

      expect(result.current.killSwitchState).toEqual({
        hasFailed: false,
        isBlocking: false,
        isLoading: false,
        isRetriable: false,
        requiresBundleUpdate: true,
      });
    });
  });

  describe('Failure', () => {
    it('sets isBlocking=true, hasFailed=true and isRetriable=true on fetch error', async () => {
      fetchMock.mockRejectOnce(new Error('Some Random Error'));

      const {result} = renderHook(useTestHook, {wrapper: RecoilRoot});

      expect(result.current.killSwitchState).toEqual({
        hasFailed: false,
        isBlocking: false,
        isLoading: false,
        isRetriable: false,
        requiresBundleUpdate: false,
      });

      await act(async () => {
        await expect(result.current.checkKillSwitch()).rejects.toThrow(
          new Error('Kill Switch failed'),
        );
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);

      expect(result.current.killSwitchState).toEqual({
        hasFailed: true,
        isBlocking: true,
        isLoading: false,
        isRetriable: true,
        requiresBundleUpdate: false,
      });
    });

    it("doesn't block failed network requests", async () => {
      fetchMock.mockRejectOnce(new Error('Network request failed'));

      const {result} = renderHook(useTestHook, {wrapper: RecoilRoot});

      expect(result.current.killSwitchState).toEqual({
        hasFailed: false,
        isBlocking: false,
        isLoading: false,
        isRetriable: false,
        requiresBundleUpdate: false,
      });

      await act(async () => {
        await expect(result.current.checkKillSwitch()).rejects.toThrow(
          new Error('Kill Switch failed'),
        );
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);

      expect(result.current.killSwitchState).toEqual({
        hasFailed: true,
        isBlocking: false,
        isLoading: false,
        isRetriable: true,
        requiresBundleUpdate: false,
      });
    });

    it('sets as failed on malformed server response', async () => {
      fetchMock.mockResponseOnce('foo', {status: 403});

      const {result} = renderHook(useTestHook, {wrapper: RecoilRoot});

      expect(result.current.killSwitchState).toEqual({
        hasFailed: false,
        isBlocking: false,
        isLoading: false,
        isRetriable: false,
        requiresBundleUpdate: false,
      });

      await act(async () => {
        await expect(result.current.checkKillSwitch()).rejects.toThrow(
          new Error('Failed to read Kill Switch body'),
        );
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);

      expect(result.current.killSwitchState).toEqual({
        hasFailed: true,
        isBlocking: true,
        isLoading: false,
        isRetriable: true,
        requiresBundleUpdate: false,
      });
    });
  });
});

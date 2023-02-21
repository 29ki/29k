import {renderHook, act} from '@testing-library/react-hooks';
import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';
import {pick} from 'ramda';
import useKillSwitchState from '../state/state';

import useKillSwitch from './useKillSwitch';

enableFetchMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('useKillSwitch', () => {
  const useTestHook = () => {
    const checkKillSwitch = useKillSwitch();
    const killSwitchState = useKillSwitchState(
      pick([
        'isBlocking',
        'isLoading',
        'requiresBundleUpdate',
        'isRetriable',
        'hasFailed',
        'message',
      ]),
    );

    return {checkKillSwitch, killSwitchState};
  };

  describe('Success', () => {
    it('checks if the app is killed', async () => {
      fetchMock.mockResponseOnce('', {status: 200});

      const {result} = renderHook(useTestHook);

      await act(() => result.current.checkKillSwitch());

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        'some-api-endpoint/killSwitch?platform=some-os&platformVersion=some-os-version&version=some-version&bundleVersion=1337',
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': 'en',
            'X-Correlation-ID': expect.any(String),
          },
        },
      );
    });

    it('sets isBlocking=true if server says no', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}), {status: 404});

      const {result} = renderHook(useTestHook);

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
        message: {},
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
        {status: 404},
      );

      const {result} = renderHook(useTestHook);

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
        message: {},
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
        {status: 404},
      );

      const {result} = renderHook(useTestHook);

      expect(result.current.killSwitchState.message).toBe(undefined);

      await act(async () => {
        await expect(result.current.checkKillSwitch()).rejects.toThrow(
          new Error('some-ossome-os-version@some-version is Kill Switched'),
        );
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);

      expect(result.current.killSwitchState.message).toEqual({
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

      const {result} = renderHook(useTestHook);

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

      const {result} = renderHook(useTestHook);

      expect(result.current.killSwitchState).toEqual({
        hasFailed: false,
        isBlocking: false,
        isLoading: false,
        isRetriable: false,
        requiresBundleUpdate: false,
      });

      await act(async () => {
        await expect(result.current.checkKillSwitch()).rejects.toThrow(
          new Error('Kill Switch failed', {
            cause: new Error('Some Random Error'),
          }),
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

      const {result} = renderHook(useTestHook);

      expect(result.current.killSwitchState).toEqual({
        hasFailed: false,
        isBlocking: false,
        isLoading: false,
        isRetriable: false,
        requiresBundleUpdate: false,
      });

      await act(async () => {
        await expect(result.current.checkKillSwitch()).rejects.toThrow(
          new Error('Kill Switch failed', {
            cause: new Error('Network request failed'),
          }),
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
      fetchMock.mockResponseOnce('foo', {status: 404});

      const {result} = renderHook(useTestHook);

      expect(result.current.killSwitchState).toEqual({
        hasFailed: false,
        isBlocking: false,
        isLoading: false,
        isRetriable: false,
        requiresBundleUpdate: false,
      });

      await act(async () => {
        await expect(result.current.checkKillSwitch()).rejects.toThrow(
          new Error('Failed to read Kill Switch body', {
            cause: new Error('Unexpected token o in JSON at position 1'),
          }),
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

import {renderHook, act} from '@testing-library/react-hooks';
import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';
import {RecoilState} from 'recoil';
import {killSwitchFields, killSwitchMessageAtom} from '../state/state';

import useKillSwitch from './useKillSwitch';

enableFetchMocks();

const mockSetRecoilState = jest.fn();
const mockResetRecoilState = jest.fn();
jest.mock('recoil', () => ({
  ...jest.requireActual('recoil'),
  useSetRecoilState: (atom: RecoilState<boolean>) => (value: any) =>
    mockSetRecoilState(atom, value),
  useResetRecoilState: () => mockResetRecoilState,
}));

beforeEach(() => {
  fetchMock.resetMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('useKillSwitch', () => {
  describe('Success', () => {
    it('checks if the app is killed', async () => {
      fetchMock.mockResponseOnce('', {status: 200});

      const {result} = renderHook(() => useKillSwitch());

      await act(() => result.current());

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        'some-killswitch-endpoint?platform=some-os&platformVersion=some-os-version&version=some-version&bundleVersion=1337&language=en',
      );
    });

    it('blocks the app if server says no', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}), {status: 403});

      const {result} = renderHook(() => useKillSwitch());

      await act(async () => {
        await expect(result.current()).rejects.toThrow(
          new Error('some-ossome-os-version@some-version is Kill Switched'),
        );
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);

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

      expect(mockResetRecoilState).toHaveBeenCalledTimes(1);

      expect(mockSetRecoilState).toHaveBeenCalledTimes(6);
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isLoading'),
        true,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('requiresBundleUpdate'),
        false,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isBlocking'),
        true,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isRetriable'),
        true,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isLoading'),
        false,
      );
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

      const {result} = renderHook(() => useKillSwitch());

      await act(async () => {
        await expect(result.current()).rejects.toThrow(
          new Error('some-ossome-os-version@some-version is Kill Switched'),
        );
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);

      expect(mockResetRecoilState).toHaveBeenCalledTimes(1);

      expect(mockSetRecoilState).toHaveBeenCalledTimes(6);
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isLoading'),
        true,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('requiresBundleUpdate'),
        false,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isBlocking'),
        true,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isRetriable'),
        true,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isLoading'),
        false,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(killSwitchMessageAtom, {
        image: 'http://some/image.jpg',
        message: 'Some Message',
        button: {
          text: 'Some Button Text',
          link: 'http://some.link',
        },
      });
    });

    it('sets requiresBundleUpdate if server says so', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          requiresBundleUpdate: true,
        }),
        {status: 200},
      );

      const {result} = renderHook(() => useKillSwitch());

      await act(async () => {
        await expect(result.current()).resolves.toBe(undefined);
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);

      expect(mockResetRecoilState).toHaveBeenCalledTimes(1);

      expect(mockSetRecoilState).toHaveBeenCalledTimes(4);
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isLoading'),
        true,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('requiresBundleUpdate'),
        true,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isBlocking'),
        false,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isLoading'),
        false,
      );
    });
  });

  describe('Failure', () => {
    it('sets as failed on fetch error', async () => {
      fetchMock.mockRejectOnce(new Error('Some Random Error'));

      const {result} = renderHook(() => useKillSwitch());

      await act(async () => {
        await expect(result.current()).rejects.toThrow(
          new Error('Kill Switch failed'),
        );
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);

      expect(mockResetRecoilState).toHaveBeenCalledTimes(1);

      expect(mockSetRecoilState).toHaveBeenCalledTimes(4);
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isLoading'),
        true,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isRetriable'),
        true,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('hasFailed'),
        true,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isLoading'),
        false,
      );
    });

    it("doesn't block failed network requests", async () => {
      fetchMock.mockRejectOnce(new Error('Network request failed'));

      const {result} = renderHook(() => useKillSwitch());

      await act(async () => {
        await expect(result.current()).rejects.toThrow(
          new Error('Kill Switch failed'),
        );
      });

      expect(mockResetRecoilState).toHaveBeenCalledTimes(1);

      expect(mockSetRecoilState).toHaveBeenCalledTimes(5);
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isLoading'),
        true,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isBlocking'),
        false,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isRetriable'),
        true,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('hasFailed'),
        true,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isLoading'),
        false,
      );
    });

    it('sets as failed on malformed server response', async () => {
      fetchMock.mockResponseOnce('foo', {status: 403});

      const {result} = renderHook(() => useKillSwitch());

      await act(async () => {
        await expect(result.current()).rejects.toThrow(
          new Error('Failed to read Kill Switch body'),
        );
      });

      expect(mockResetRecoilState).toHaveBeenCalledTimes(1);

      expect(mockSetRecoilState).toHaveBeenCalledTimes(5);
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isLoading'),
        true,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isBlocking'),
        true,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isRetriable'),
        true,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('hasFailed'),
        true,
      );
      expect(mockSetRecoilState).toHaveBeenCalledWith(
        killSwitchFields('isLoading'),
        false,
      );
    });
  });
});

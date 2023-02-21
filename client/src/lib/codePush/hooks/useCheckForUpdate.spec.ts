import {renderHook, act} from '@testing-library/react-hooks';
import {pick} from 'ramda';
import codePush from 'react-native-code-push';
import useCodePushState from '../state/state';

import useCheckForUpdate from './useCheckForUpdate';

const codePushMock = codePush as unknown as jest.Mocked<typeof codePush>;

afterEach(() => {
  jest.clearAllMocks();
});

describe('useCheckForUpdate', () => {
  const useTestHook = () => {
    const checkCodePush = useCheckForUpdate();
    const codePushState = useCodePushState(
      pick(['status', 'updateAvailable', 'downloadProgress']),
    );

    return {
      checkCodePush,
      codePushState,
    };
  };

  describe('Success', () => {
    it('calls codePush.sync', () => {
      const {result} = renderHook(useTestHook);

      act(() => {
        result.current.checkCodePush();
      });

      expect(codePushMock.sync).toHaveBeenCalledTimes(1);
      expect(codePushMock.sync).toHaveBeenCalledWith(
        {
          deploymentKey: 'some-ios-code-push-deployment-key',
          mandatoryInstallMode: 1337,
        },
        expect.any(Function),
        expect.any(Function),
      );
    });

    it('sets the status', () => {
      codePushMock.sync.mockImplementationOnce(
        (options, onStatus = () => {}) => {
          onStatus(codePushMock.SyncStatus.SYNC_IN_PROGRESS);

          return Promise.resolve(codePushMock.SyncStatus.SYNC_IN_PROGRESS);
        },
      );

      const {result} = renderHook(useTestHook);

      act(() => {
        result.current.checkCodePush();
      });

      expect(codePushMock.sync).toHaveBeenCalledTimes(1);

      expect(result.current.codePushState.status).toBe(4);
      expect(result.current.codePushState.updateAvailable).toBe(false);
    });

    it('sets the status and updateAvailable on UPDATE_INSTALLED', () => {
      codePushMock.sync.mockImplementationOnce(
        (options, onStatus = () => {}) => {
          onStatus(codePushMock.SyncStatus.UPDATE_INSTALLED);

          return Promise.resolve(codePushMock.SyncStatus.UPDATE_INSTALLED);
        },
      );

      const {result} = renderHook(useTestHook);

      act(() => {
        result.current.checkCodePush();
      });

      expect(codePushMock.sync).toHaveBeenCalledTimes(1);

      expect(result.current.codePushState.status).toBe(1);
      expect(result.current.codePushState.updateAvailable).toBe(true);
    });

    it('sets the downloadProgress state on download', () => {
      codePushMock.sync.mockImplementationOnce(
        (options, onStatus = () => {}, onProgress = () => {}) => {
          onStatus(codePushMock.SyncStatus.DOWNLOADING_PACKAGE);
          onProgress({receivedBytes: 500, totalBytes: 1000});

          return Promise.resolve(codePushMock.SyncStatus.DOWNLOADING_PACKAGE);
        },
      );

      const {result} = renderHook(useTestHook);

      act(() => {
        result.current.checkCodePush();
      });

      expect(codePushMock.sync).toHaveBeenCalledTimes(1);

      expect(result.current.codePushState.status).toBe(7);
      expect(result.current.codePushState.updateAvailable).toBe(false);
      expect(result.current.codePushState.downloadProgress).toBe(0.5);
    });
  });

  describe('Failure', () => {
    it('throws on CodePush error', async () => {
      codePushMock.sync.mockRejectedValue(new Error('Some Random Error'));

      const {result} = renderHook(useTestHook);

      await act(async () => {
        await expect(result.current.checkCodePush()).rejects.toThrow(
          new Error('Code Push check failed', {
            cause: new Error('Some Random Error'),
          }),
        );
      });

      expect(codePushMock.sync).toHaveBeenCalledTimes(1);
    });
  });
});

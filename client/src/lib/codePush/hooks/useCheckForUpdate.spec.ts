import {renderHook, act} from '@testing-library/react-hooks';
import codePush from 'react-native-code-push';
import {RecoilRoot, useRecoilValue} from 'recoil';
import {
  downloadProgressAtom,
  statusAtom,
  updateAvailableAtom,
} from '../state/state';

import useCheckForUpdate from './useCheckForUpdate';

const codePushMock = codePush as unknown as jest.Mocked<typeof codePush>;

afterEach(() => {
  jest.clearAllMocks();
});

describe('useCheckForUpdate', () => {
  const useTestHook = () => {
    const checkCodePush = useCheckForUpdate();
    const downloadProgressState = useRecoilValue(downloadProgressAtom);
    const statusState = useRecoilValue(statusAtom);
    const updateAvailableState = useRecoilValue(updateAvailableAtom);

    return {
      checkCodePush,
      downloadProgressState,
      statusState,
      updateAvailableState,
    };
  };

  describe('Success', () => {
    it('calls codePush.sync', () => {
      const {result} = renderHook(useTestHook, {wrapper: RecoilRoot});

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

      const {result} = renderHook(useTestHook, {wrapper: RecoilRoot});

      act(() => {
        result.current.checkCodePush();
      });

      expect(codePushMock.sync).toHaveBeenCalledTimes(1);

      expect(result.current.statusState).toBe(4);
      expect(result.current.updateAvailableState).toBe(false);
    });

    it('sets the status and updateAvailable on UPDATE_INSTALLED', () => {
      codePushMock.sync.mockImplementationOnce(
        (options, onStatus = () => {}) => {
          onStatus(codePushMock.SyncStatus.UPDATE_INSTALLED);

          return Promise.resolve(codePushMock.SyncStatus.UPDATE_INSTALLED);
        },
      );

      const {result} = renderHook(useTestHook, {wrapper: RecoilRoot});

      act(() => {
        result.current.checkCodePush();
      });

      expect(codePushMock.sync).toHaveBeenCalledTimes(1);

      expect(result.current.statusState).toBe(1);
      expect(result.current.updateAvailableState).toBe(true);
    });

    it('sets the downloadProgress state on download', () => {
      codePushMock.sync.mockImplementationOnce(
        (options, onStatus = () => {}, onProgress = () => {}) => {
          onStatus(codePushMock.SyncStatus.DOWNLOADING_PACKAGE);
          onProgress({receivedBytes: 500, totalBytes: 1000});

          return Promise.resolve(codePushMock.SyncStatus.DOWNLOADING_PACKAGE);
        },
      );

      const {result} = renderHook(useTestHook, {wrapper: RecoilRoot});

      act(() => {
        result.current.checkCodePush();
      });

      expect(codePushMock.sync).toHaveBeenCalledTimes(1);

      expect(result.current.statusState).toBe(7);
      expect(result.current.updateAvailableState).toBe(false);
      expect(result.current.downloadProgressState).toBe(0.5);
    });
  });

  describe('Failure', () => {
    it('throws on CodePush error', () => {
      codePushMock.sync.mockRejectedValue(new Error('Some Random Error'));

      const {result} = renderHook(useTestHook, {wrapper: RecoilRoot});

      act(() => {
        expect(result.current.checkCodePush()).rejects.toThrow(
          new Error('Code Push check failed'),
        );
      });

      expect(codePushMock.sync).toHaveBeenCalledTimes(1);
    });
  });
});

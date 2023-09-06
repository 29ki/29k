import {renderHook} from '@testing-library/react-hooks';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {
  PERMISSIONS,
  checkMultiple,
  openSettings,
} from 'react-native-permissions';
import useCheckPermissions from './useCheckPermissions';

const mockAlert = Alert.alert as jest.Mock;

jest.mock('../../../lib/daily/DailyProvider', () => ({
  DailyContext: jest.fn(),
}));

const mockCheckMultiple = checkMultiple as jest.Mock;
const mockOpenSettings = openSettings as jest.Mock;

const mockRestartApp = jest.fn();
jest.mock(
  '../../../lib/codePush/hooks/useRestartApp',
  () => () => mockRestartApp,
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useCheckPermissions', () => {
  const {t} = useTranslation();
  (t as unknown as jest.Mock).mockReturnValue('Some translation');

  describe('checkPermissions', () => {
    it('defaults to check both camera and microphone permissions', async () => {
      const {result} = renderHook(() => useCheckPermissions());

      mockCheckMultiple.mockResolvedValueOnce({
        CAMERA: 'granted',
        MICROPHONE: 'granted',
      });

      expect(await result.current.checkPermissions()).toBe(true);
      expect(mockCheckMultiple).toHaveBeenCalledTimes(1);
      expect(mockCheckMultiple).toHaveBeenCalledWith(
        expect.arrayContaining(['CAMERA', 'MICROPHONE']),
      );
    });

    it('returns false if any permission is not granted', async () => {
      const {result} = renderHook(() => useCheckPermissions());

      mockCheckMultiple.mockResolvedValueOnce({
        CAMERA: 'granted',
        MICROPHONE: 'denied',
      });

      expect(await result.current.checkPermissions()).toBe(false);
    });

    it('allows for checking specific permissions', async () => {
      const {result} = renderHook(() => useCheckPermissions());

      mockCheckMultiple.mockResolvedValueOnce({
        CAMERA: 'granted',
      });

      expect(
        await result.current.checkPermissions([PERMISSIONS.IOS.CAMERA]),
      ).toBe(true);
      expect(mockCheckMultiple).toHaveBeenCalledWith(
        expect.arrayContaining(['CAMERA']),
      );
    });
  });

  describe('checkAndPromptCameraPermissions', () => {
    it('runs onGranted callback if permissions are given', async () => {
      const {result} = renderHook(() => useCheckPermissions());

      mockCheckMultiple.mockResolvedValueOnce({CAMERA: 'granted'});

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      await result.current.checkAndPromptCameraPermissions(
        onGranted,
        onDismiss,
      );

      expect(onGranted).toHaveBeenCalledTimes(1);
      expect(onDismiss).toHaveBeenCalledTimes(0);
    });

    it('triggers onDismiss if permissions are denied and user dismiss', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the dimiss action
        config[0].onPress();
      });

      const {result} = renderHook(() => useCheckPermissions());

      mockCheckMultiple.mockResolvedValueOnce({CAMERA: 'denied'});

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      await result.current.checkAndPromptCameraPermissions(
        onGranted,
        onDismiss,
      );

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith(
        'Some translation',
        'Some translation',
        [
          {
            onPress: expect.any(Function),
            text: 'Some translation',
          },
          {
            onPress: expect.any(Function),
            style: 'cancel',
            text: 'Some translation',
          },
        ],
      );
      expect(onGranted).toHaveBeenCalledTimes(0);
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('opens settings and restarts app if permissions are denied and user confirms', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the confirm action
        config[1].onPress();
      });

      const {result} = renderHook(() => useCheckPermissions());

      mockCheckMultiple.mockResolvedValueOnce({CAMERA: 'denied'});

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      await result.current.checkAndPromptCameraPermissions(
        onGranted,
        onDismiss,
      );

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith(
        'Some translation',
        'Some translation',
        [
          {
            onPress: expect.any(Function),
            text: 'Some translation',
          },
          {
            onPress: expect.any(Function),
            style: 'cancel',
            text: 'Some translation',
          },
        ],
      );
      expect(mockOpenSettings).toHaveBeenCalledTimes(1);
      expect(mockRestartApp).toHaveBeenCalledTimes(1);
      expect(onGranted).toHaveBeenCalledTimes(0);
      expect(onDismiss).toHaveBeenCalledTimes(0);
    });
  });

  describe('checkAndPromptMicrophonePermissions', () => {
    it('runs onGranted callback if permissions are given', async () => {
      const {result} = renderHook(() => useCheckPermissions());

      mockCheckMultiple.mockResolvedValueOnce({MICROPHONE: 'granted'});

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      await result.current.checkAndPromptMicrophonePermissions(
        onGranted,
        onDismiss,
      );

      expect(onGranted).toHaveBeenCalledTimes(1);
      expect(onDismiss).toHaveBeenCalledTimes(0);
    });

    it('triggers onDismiss if permissions are denied and user dismiss', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the dimiss action
        config[0].onPress();
      });

      const {result} = renderHook(() => useCheckPermissions());

      mockCheckMultiple.mockResolvedValueOnce({MICROPHONE: 'denied'});

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      await result.current.checkAndPromptMicrophonePermissions(
        onGranted,
        onDismiss,
      );

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith(
        'Some translation',
        'Some translation',
        [
          {
            onPress: expect.any(Function),
            text: 'Some translation',
          },
          {
            onPress: expect.any(Function),
            style: 'cancel',
            text: 'Some translation',
          },
        ],
      );
      expect(onGranted).toHaveBeenCalledTimes(0);
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('opens settings and restarts app if permissions are denied and user confirms', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the confirm action
        config[1].onPress();
      });

      const {result} = renderHook(() => useCheckPermissions());

      mockCheckMultiple.mockResolvedValueOnce({MICROPHONE: 'denied'});

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      await result.current.checkAndPromptMicrophonePermissions(
        onGranted,
        onDismiss,
      );

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith(
        'Some translation',
        'Some translation',
        [
          {
            onPress: expect.any(Function),
            text: 'Some translation',
          },
          {
            onPress: expect.any(Function),
            style: 'cancel',
            text: 'Some translation',
          },
        ],
      );
      expect(mockOpenSettings).toHaveBeenCalledTimes(1);
      expect(mockRestartApp).toHaveBeenCalledTimes(1);
      expect(onGranted).toHaveBeenCalledTimes(0);
      expect(onDismiss).toHaveBeenCalledTimes(0);
    });
  });

  describe('checkAndPromptJoinPermissions', () => {
    it('runs onGranted callback if permissions are given', async () => {
      const {result} = renderHook(() => useCheckPermissions());

      mockCheckMultiple.mockResolvedValueOnce({
        MICROPHONE: 'granted',
        CAMERA: 'granted',
      });

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      await result.current.checkAndPromptJoinPermissions(onGranted, onDismiss);

      expect(onGranted).toHaveBeenCalledTimes(1);
      expect(onDismiss).toHaveBeenCalledTimes(0);
    });

    it('triggers onDismiss if permissions are denied and user dismiss', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the dimiss action
        config[0].onPress();
      });

      const {result} = renderHook(() => useCheckPermissions());

      mockCheckMultiple.mockResolvedValueOnce({
        MICROPHONE: 'denied',
        CAMERA: 'denied',
      });

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      await result.current.checkAndPromptJoinPermissions(onGranted, onDismiss);

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith(
        'Some translation',
        'Some translation',
        [
          {
            onPress: expect.any(Function),
            text: 'Some translation',
          },
          {
            onPress: expect.any(Function),
            style: 'cancel',
            text: 'Some translation',
          },
        ],
      );
      expect(onGranted).toHaveBeenCalledTimes(0);
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('triggers onGranted if onDismiss is undefined, permissions are denied and user dismiss', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the dimiss action
        config[0].onPress();
      });

      const {result} = renderHook(() => useCheckPermissions());

      mockCheckMultiple.mockResolvedValueOnce({
        MICROPHONE: 'denied',
        CAMERA: 'denied',
      });

      const onGranted = jest.fn();
      await result.current.checkAndPromptJoinPermissions(onGranted);

      expect(onGranted).toHaveBeenCalledTimes(1);
    });

    it('opens settings and restarts app if permissions are denied and user confirms', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the confirm action
        config[1].onPress();
      });

      const {result} = renderHook(() => useCheckPermissions());

      mockCheckMultiple.mockResolvedValueOnce({
        MICROPHONE: 'denied',
        CAMERA: 'denied',
      });

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      await result.current.checkAndPromptJoinPermissions(onGranted, onDismiss);

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith(
        'Some translation',
        'Some translation',
        [
          {
            onPress: expect.any(Function),
            text: 'Some translation',
          },
          {
            onPress: expect.any(Function),
            style: 'cancel',
            text: 'Some translation',
          },
        ],
      );
      expect(mockOpenSettings).toHaveBeenCalledTimes(1);
      expect(mockRestartApp).toHaveBeenCalledTimes(1);
      expect(onGranted).toHaveBeenCalledTimes(0);
      expect(onDismiss).toHaveBeenCalledTimes(0);
    });
  });
});

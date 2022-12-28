import {renderHook} from '@testing-library/react-hooks';
import {useTranslation} from 'react-i18next';
import {Alert, Linking} from 'react-native';
import useCheckPermissions from './useCheckPermissions';

const mockAlert = Alert.alert as jest.Mock;
const mockOpenSettings = Linking.openSettings as jest.Mock;

jest.mock('../../../lib/daily/DailyProvider', () => ({
  DailyContext: jest.fn(),
}));

const mockHasCameraPermissions = jest.fn();
const mockHasMicrophonePermissions = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(() => ({
    hasCameraPermissions: mockHasCameraPermissions,
    hasMicrophonePermissions: mockHasMicrophonePermissions,
  })),
}));

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

  describe('checkCameraPermissions', () => {
    it('runs onGranted callback if permissions are given', async () => {
      const {result} = renderHook(() => useCheckPermissions());

      mockHasCameraPermissions.mockReturnValue(true);

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      await result.current.checkCameraPermissions(onGranted, onDismiss);

      expect(onGranted).toHaveBeenCalledTimes(1);
      expect(onDismiss).toHaveBeenCalledTimes(0);
    });

    it('triggers alert if permissions are denied', () => {
      const {result} = renderHook(() => useCheckPermissions());

      mockHasCameraPermissions.mockReturnValue(false);

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      result.current.checkCameraPermissions(onGranted, onDismiss);

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
      expect(onDismiss).toHaveBeenCalledTimes(0);
    });

    it('triggers onDismiss if permissions are denied and user dismiss', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the dimiss action
        config[0].onPress();
      });

      const {result} = renderHook(() => useCheckPermissions());

      mockHasCameraPermissions.mockReturnValue(false);

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      await result.current.checkCameraPermissions(onGranted, onDismiss);

      expect(onGranted).toHaveBeenCalledTimes(0);
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('opens settings and restarts app if permissions are denied and user confirms', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the confirm action
        config[1].onPress();
      });

      const {result} = renderHook(() => useCheckPermissions());

      mockHasCameraPermissions.mockReturnValue(false);

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      await result.current.checkCameraPermissions(onGranted, onDismiss);

      expect(mockOpenSettings).toHaveBeenCalledTimes(1);
      expect(mockRestartApp).toHaveBeenCalledTimes(1);
      expect(onGranted).toHaveBeenCalledTimes(0);
      expect(onDismiss).toHaveBeenCalledTimes(0);
    });
  });

  describe('checkMicrophonePermissions', () => {
    it('runs onGranted callback if permissions are given', async () => {
      const {result} = renderHook(() => useCheckPermissions());

      mockHasMicrophonePermissions.mockReturnValue(true);

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      await result.current.checkMicrophonePermissions(onGranted, onDismiss);

      expect(onGranted).toHaveBeenCalledTimes(1);
      expect(onDismiss).toHaveBeenCalledTimes(0);
    });

    it('triggers alert if permissions are denied', () => {
      const {result} = renderHook(() => useCheckPermissions());

      mockHasMicrophonePermissions.mockReturnValue(false);

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      result.current.checkMicrophonePermissions(onGranted, onDismiss);

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
      expect(onDismiss).toHaveBeenCalledTimes(0);
    });

    it('triggers onDismiss if permissions are denied and user dismiss', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the dimiss action
        config[0].onPress();
      });

      const {result} = renderHook(() => useCheckPermissions());

      mockHasMicrophonePermissions.mockReturnValue(false);

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      await result.current.checkMicrophonePermissions(onGranted, onDismiss);

      expect(onGranted).toHaveBeenCalledTimes(0);
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('opens settings and restarts app if permissions are denied and user confirms', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the confirm action
        config[1].onPress();
      });

      const {result} = renderHook(() => useCheckPermissions());

      mockHasMicrophonePermissions.mockReturnValue(false);

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      await result.current.checkMicrophonePermissions(onGranted, onDismiss);

      expect(mockOpenSettings).toHaveBeenCalledTimes(1);
      expect(mockRestartApp).toHaveBeenCalledTimes(1);
      expect(onGranted).toHaveBeenCalledTimes(0);
      expect(onDismiss).toHaveBeenCalledTimes(0);
    });
  });

  describe('checkJoinPermissions', () => {
    it('runs onGranted callback if permissions are given', async () => {
      const {result} = renderHook(() => useCheckPermissions());

      mockHasCameraPermissions.mockReturnValue(true);
      mockHasMicrophonePermissions.mockReturnValue(true);

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      await result.current.checkJoinPermissions(onGranted, onDismiss);

      expect(onGranted).toHaveBeenCalledTimes(1);
      expect(onDismiss).toHaveBeenCalledTimes(0);
    });

    it('triggers alert if any of the permissions are denied', () => {
      const {result} = renderHook(() => useCheckPermissions());

      mockHasCameraPermissions.mockReturnValue(true);
      mockHasMicrophonePermissions.mockReturnValue(false);

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      result.current.checkJoinPermissions(onGranted, onDismiss);

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
      expect(onDismiss).toHaveBeenCalledTimes(0);
    });

    it('triggers onDismiss if permissions are denied and user dismiss', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the dimiss action
        config[0].onPress();
      });

      const {result} = renderHook(() => useCheckPermissions());

      mockHasCameraPermissions.mockReturnValue(false);
      mockHasMicrophonePermissions.mockReturnValue(false);

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      await result.current.checkJoinPermissions(onGranted, onDismiss);

      expect(onGranted).toHaveBeenCalledTimes(0);
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('triggers onGranted if onDismiss is undefined, permissions are denied and user dismiss', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the dimiss action
        config[0].onPress();
      });

      const {result} = renderHook(() => useCheckPermissions());

      mockHasCameraPermissions.mockReturnValue(false);
      mockHasMicrophonePermissions.mockReturnValue(false);

      const onGranted = jest.fn();
      await result.current.checkJoinPermissions(onGranted);

      expect(onGranted).toHaveBeenCalledTimes(1);
    });

    it('opens settings and restarts app if permissions are denied and user confirms', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the confirm action
        config[1].onPress();
      });

      const {result} = renderHook(() => useCheckPermissions());

      mockHasCameraPermissions.mockReturnValue(false);
      mockHasMicrophonePermissions.mockReturnValue(false);

      const onGranted = jest.fn();
      const onDismiss = jest.fn();
      await result.current.checkJoinPermissions(onGranted, onDismiss);

      expect(mockOpenSettings).toHaveBeenCalledTimes(1);
      expect(mockRestartApp).toHaveBeenCalledTimes(1);
      expect(onGranted).toHaveBeenCalledTimes(0);
      expect(onDismiss).toHaveBeenCalledTimes(0);
    });
  });
});

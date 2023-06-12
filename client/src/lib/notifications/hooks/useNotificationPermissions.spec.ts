import {Alert, Linking} from 'react-native';
import {renderHook} from '@testing-library/react-hooks';
import notifee, {
  AuthorizationStatus,
  NotificationSettings,
} from '@notifee/react-native';

import useNotificationPermissions from './useNotificationPermissions';

const mockRequestPermission = jest.mocked(notifee.requestPermission);
const mockNotificationSettings = jest.mocked(notifee.getNotificationSettings);
const mockAlert = jest.mocked(Alert.alert);
const mockOpenSettings = jest.mocked(Linking.openSettings);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useRequestNotificationPermission', () => {
  describe('requestPermission', () => {
    it('requests permission and returns the notification settings object', async () => {
      mockRequestPermission.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.AUTHORIZED,
      } as NotificationSettings);

      const {result} = renderHook(() => useNotificationPermissions());

      const settings = await result.current.requestPermission();

      expect(mockRequestPermission).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledTimes(0);
      expect(settings).toEqual({
        authorizationStatus: AuthorizationStatus.AUTHORIZED,
      });
    });

    it('throws and prompts the user if permission is DENIED', async () => {
      mockRequestPermission.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.DENIED,
      } as NotificationSettings);

      const {result} = renderHook(() => useNotificationPermissions());

      await expect(result.current.requestPermission()).rejects.toThrow(
        'Notification permission denied',
      );

      expect(mockRequestPermission).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        [
          {style: 'cancel', text: expect.any(String)},
          {
            style: 'default',
            text: expect.any(String),
            onPress: expect.any(Function),
          },
        ],
      );
    });

    it('opens settings from prompt', async () => {
      mockRequestPermission.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.DENIED,
      } as NotificationSettings);

      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the confirm action
        if (config?.[1]?.onPress) {
          config[1].onPress();
        }
      });

      const {result} = renderHook(() => useNotificationPermissions());

      await expect(result.current.requestPermission()).rejects.toThrow(
        'Notification permission denied',
      );

      expect(mockOpenSettings).toHaveBeenCalledTimes(1);
    });
  });

  describe('checkPermission', () => {
    it('returns true if permission is AUTHORIZED', async () => {
      mockNotificationSettings.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.AUTHORIZED,
      } as NotificationSettings);

      const {result} = renderHook(() => useNotificationPermissions());

      const hasPermission = await result.current.checkPermission();

      expect(mockNotificationSettings).toHaveBeenCalledTimes(1);
      expect(hasPermission).toBe(true);
    });

    it('returns true if permission is PROVISIONAL', async () => {
      mockNotificationSettings.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.PROVISIONAL,
      } as NotificationSettings);

      const {result} = renderHook(() => useNotificationPermissions());

      const hasPermission = await result.current.checkPermission();

      expect(mockNotificationSettings).toHaveBeenCalledTimes(1);
      expect(hasPermission).toBe(true);
    });

    it('returns false if permission is DENIED', async () => {
      mockNotificationSettings.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.DENIED,
      } as NotificationSettings);

      const {result} = renderHook(() => useNotificationPermissions());

      const hasPermission = await result.current.checkPermission();

      expect(mockNotificationSettings).toHaveBeenCalledTimes(1);
      expect(hasPermission).toBe(false);
    });

    it('returns false if permission is NOT_DETERMINED', async () => {
      mockNotificationSettings.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.NOT_DETERMINED,
      } as NotificationSettings);

      const {result} = renderHook(() => useNotificationPermissions());

      const hasPermission = await result.current.checkPermission();

      expect(mockNotificationSettings).toHaveBeenCalledTimes(1);
      expect(hasPermission).toBe(false);
    });
  });
});

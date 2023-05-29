import {Alert, Linking} from 'react-native';
import {renderHook} from '@testing-library/react-hooks';
import notifee, {
  AuthorizationStatus,
  NotificationSettings,
} from '@notifee/react-native';

import useNotificationPermissions from './useNotificationPermissions';

const mockRequestPermission = jest.mocked(notifee.requestPermission);
const mockAlert = jest.mocked(Alert.alert);
const mockOpenSettings = jest.mocked(Linking.openSettings);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useRequestNotificationPermission', () => {
  it('requests permission and returns the notification settings object', async () => {
    mockRequestPermission.mockResolvedValueOnce({
      authorizationStatus: AuthorizationStatus.AUTHORIZED,
    } as NotificationSettings);

    const {result} = renderHook(() => useNotificationPermissions());

    const settings = await result.current();

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

    await expect(result.current()).rejects.toThrow(
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

    await expect(result.current()).rejects.toThrow(
      'Notification permission denied',
    );

    expect(mockOpenSettings).toHaveBeenCalledTimes(1);
  });
});

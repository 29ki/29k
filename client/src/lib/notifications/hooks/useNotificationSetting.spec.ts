import {act, renderHook} from '@testing-library/react-hooks';
import notifee, {
  AuthorizationStatus,
  NotificationSettings,
} from '@notifee/react-native';

import useUserState from '../../user/state/state';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import useNotificationSetting from './useNotificationSetting';

const mockGetNotificationSettings = jest.mocked(
  notifee.getNotificationSettings,
);
const mockCancelAllNotifications = jest.mocked(notifee.cancelAllNotifications);

const mockRequestPermission = jest.fn();
jest.mock(
  './useRequestNotificationPermission',
  () => () => mockRequestPermission,
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useNotificationSetting', () => {
  describe('notificationsEnabled', () => {
    it('is enabled if permission is AUTHORIZED and notificationEnabled = true', async () => {
      mockGetNotificationSettings.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.AUTHORIZED,
      } as NotificationSettings);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {notificationsEnabled: true}},
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        useNotificationSetting(),
      );

      await waitForNextUpdate();

      expect(mockGetNotificationSettings).toHaveBeenCalledTimes(1);
      expect(result.current.notificationsEnabled).toBe(true);
    });

    it('is enabled if permission is PROVISIONAL and notificationEnabled == true', async () => {
      mockGetNotificationSettings.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.PROVISIONAL,
      } as NotificationSettings);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {notificationsEnabled: true}},
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        useNotificationSetting(),
      );

      await waitForNextUpdate();

      expect(mockGetNotificationSettings).toHaveBeenCalledTimes(1);
      expect(result.current.notificationsEnabled).toBe(true);
    });

    it('is disabled if notificationEnabled == false', async () => {
      mockGetNotificationSettings.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.AUTHORIZED,
      } as NotificationSettings);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {notificationsEnabled: false}},
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        useNotificationSetting(),
      );

      await waitForNextUpdate();

      expect(mockGetNotificationSettings).toHaveBeenCalledTimes(1);
      expect(result.current.notificationsEnabled).toBe(false);
    });

    it('is disabled if permission is DENIED', async () => {
      mockGetNotificationSettings.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.DENIED,
      } as NotificationSettings);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {notificationsEnabled: true}},
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        useNotificationSetting(),
      );

      await waitForNextUpdate();

      expect(mockGetNotificationSettings).toHaveBeenCalledTimes(1);
      expect(result.current.notificationsEnabled).toBe(false);
    });

    it('is disabled if permission is NOT_DETERMINED', async () => {
      mockGetNotificationSettings.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.NOT_DETERMINED,
      } as NotificationSettings);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {notificationsEnabled: true}},
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        useNotificationSetting(),
      );

      await waitForNextUpdate();

      expect(mockGetNotificationSettings).toHaveBeenCalledTimes(1);
      expect(result.current.notificationsEnabled).toBe(false);
    });
  });

  describe('setNotificationsEnabled', () => {
    it('requests permission and sets notificationEnabled to true', async () => {
      mockRequestPermission.mockResolvedValueOnce(undefined);
      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
      });

      const {result} = renderHook(() => useNotificationSetting());

      await result.current.setNotificationsEnabled(true);

      expect(mockRequestPermission).toHaveBeenCalledTimes(1);
      expect(mockCancelAllNotifications).toHaveBeenCalledTimes(0);
      expect(useUserState.getState()).toEqual(
        expect.objectContaining({
          userState: {'some-uid': {notificationsEnabled: true}},
        }),
      );
    });

    it('clears all notifications and set notificationEnabled to false', async () => {
      mockRequestPermission.mockResolvedValueOnce(undefined);
      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
      });

      const {result} = renderHook(() => useNotificationSetting());

      await result.current.setNotificationsEnabled(false);

      expect(mockRequestPermission).toHaveBeenCalledTimes(0);
      expect(mockCancelAllNotifications).toHaveBeenCalledTimes(1);
      expect(useUserState.getState()).toEqual(
        expect.objectContaining({
          userState: {'some-uid': {notificationsEnabled: false}},
        }),
      );
    });
  });
});

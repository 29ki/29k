import {act, renderHook} from '@testing-library/react-hooks';
import notifee, {
  AuthorizationStatus,
  NotificationSettings,
} from '@notifee/react-native';

import useUserState from '../../user/state/state';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import useReminderNotificationsSetting from './useReminderNotificationsSetting';
import useNotificationsState from '../state/state';

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

describe('useReminderNotificationsSetting', () => {
  describe('reminderNotifications', () => {
    it('is enabled if permission is AUTHORIZED and reminderNotifications = true', async () => {
      mockGetNotificationSettings.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.AUTHORIZED,
      } as NotificationSettings);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {reminderNotifications: true}},
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        useReminderNotificationsSetting(),
      );

      await waitForNextUpdate();

      expect(mockGetNotificationSettings).toHaveBeenCalledTimes(1);
      expect(result.current.remindersEnabled).toBe(true);
    });

    it('is enabled if permission is PROVISIONAL and reminderNotifications == true', async () => {
      mockGetNotificationSettings.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.PROVISIONAL,
      } as NotificationSettings);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {reminderNotifications: true}},
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        useReminderNotificationsSetting(),
      );

      await waitForNextUpdate();

      expect(mockGetNotificationSettings).toHaveBeenCalledTimes(1);
      expect(result.current.remindersEnabled).toBe(true);
    });

    it('is disabled if reminderNotifications == false', async () => {
      mockGetNotificationSettings.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.AUTHORIZED,
      } as NotificationSettings);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {reminderNotifications: false}},
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        useReminderNotificationsSetting(),
      );

      await waitForNextUpdate();

      expect(mockGetNotificationSettings).toHaveBeenCalledTimes(1);
      expect(result.current.remindersEnabled).toBe(false);
    });

    it('is disabled if permission is DENIED', async () => {
      mockGetNotificationSettings.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.DENIED,
      } as NotificationSettings);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {reminderNotifications: true}},
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        useReminderNotificationsSetting(),
      );

      await waitForNextUpdate();

      expect(mockGetNotificationSettings).toHaveBeenCalledTimes(1);
      expect(result.current.remindersEnabled).toBe(false);
    });

    it('is disabled if permission is NOT_DETERMINED', async () => {
      mockGetNotificationSettings.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.NOT_DETERMINED,
      } as NotificationSettings);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {reminderNotifications: true}},
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        useReminderNotificationsSetting(),
      );

      await waitForNextUpdate();

      expect(mockGetNotificationSettings).toHaveBeenCalledTimes(1);
      expect(result.current.remindersEnabled).toBe(false);
    });

    it('is undefined if reminderNotifications == undefined', async () => {
      mockGetNotificationSettings.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.AUTHORIZED,
      } as NotificationSettings);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {reminderNotifications: undefined}},
      });

      const {result} = renderHook(() => useReminderNotificationsSetting());

      expect(mockGetNotificationSettings).toHaveBeenCalledTimes(1);
      expect(result.current.remindersEnabled).toBe(undefined);
    });
  });

  describe('setRemindersEnabled', () => {
    it('requests permission and sets reminderNotifications to true', async () => {
      mockRequestPermission.mockResolvedValueOnce(undefined);
      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
      });

      const {result} = renderHook(() => useReminderNotificationsSetting());

      await act(async () => {
        await result.current.setRemindersEnabled(true);
      });

      expect(mockRequestPermission).toHaveBeenCalledTimes(1);
      expect(mockCancelAllNotifications).toHaveBeenCalledTimes(0);
      expect(useUserState.getState()).toEqual(
        expect.objectContaining({
          userState: {'some-uid': {reminderNotifications: true}},
        }),
      );
    });

    it('clears all notifications and set reminderNotifications to false', async () => {
      mockRequestPermission.mockResolvedValueOnce(undefined);
      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
      });
      useNotificationsState.setState({
        notifications: {'some-id': {id: 'some-notification-id'}},
      });

      const {result} = renderHook(() => useReminderNotificationsSetting());

      await act(async () => {
        await result.current.setRemindersEnabled(false);
      });

      expect(mockRequestPermission).toHaveBeenCalledTimes(0);
      expect(mockCancelAllNotifications).toHaveBeenCalledTimes(1);
      expect(useUserState.getState()).toEqual(
        expect.objectContaining({
          userState: {'some-uid': {reminderNotifications: false}},
        }),
      );
      expect(useNotificationsState.getState()).toEqual(
        expect.objectContaining({notifications: {}}),
      );
    });
  });
});

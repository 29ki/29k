import {act, renderHook} from '@testing-library/react-hooks';

import useUserState from '../../user/state/state';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import useSessionReminderNotificationsSetting from './useSessionReminderNotificationsSetting';
import useNotificationsState from '../state/state';

const mockRequestPermission = jest.fn();
const mockCheckPermission = jest.fn();
jest.mock('./useNotificationPermissions', () =>
  jest.fn(() => ({
    requestPermission: mockRequestPermission,
    checkPermission: mockCheckPermission,
  })),
);

const mockRemoveTriggerNotifications = jest.fn();
jest.mock('./useTriggerNotifications', () =>
  jest.fn(() => ({
    removeTriggerNotifications: mockRemoveTriggerNotifications,
  })),
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSessionReminderNotificationsSetting', () => {
  describe('reminderNotifications', () => {
    it('is enabled if having permission and reminderNotifications = true', async () => {
      mockCheckPermission.mockResolvedValueOnce(true);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {sessionReminderNotifications: true}},
      });

      const {result} = renderHook(() =>
        useSessionReminderNotificationsSetting(),
      );

      expect(mockCheckPermission).toHaveBeenCalledTimes(1);
      expect(result.current.sessionRemindersEnabled).toBe(true);
    });

    it('is disabled if reminderNotifications == false', async () => {
      mockCheckPermission.mockResolvedValueOnce(true);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {sessionReminderNotifications: false}},
      });

      const {result} = renderHook(() =>
        useSessionReminderNotificationsSetting(),
      );

      expect(mockCheckPermission).toHaveBeenCalledTimes(1);
      expect(result.current.sessionRemindersEnabled).toBe(false);
    });

    it('is disabled if not having permission', async () => {
      mockCheckPermission.mockResolvedValueOnce(false);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {sessionReminderNotifications: true}},
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        useSessionReminderNotificationsSetting(),
      );

      await waitForNextUpdate();

      expect(mockCheckPermission).toHaveBeenCalledTimes(1);
      expect(result.current.sessionRemindersEnabled).toBe(false);
    });

    it('is undefined if reminderNotifications == undefined', async () => {
      mockCheckPermission.mockResolvedValueOnce(true);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {sessionReminderNotifications: undefined}},
      });

      const {result} = renderHook(() =>
        useSessionReminderNotificationsSetting(),
      );

      expect(mockCheckPermission).toHaveBeenCalledTimes(1);
      expect(result.current.sessionRemindersEnabled).toBe(undefined);
    });
  });

  describe('setRemindersEnabled', () => {
    it('requests permission and sets reminderNotifications to true', async () => {
      mockRequestPermission.mockResolvedValueOnce(undefined);
      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
      });

      const {result} = renderHook(() =>
        useSessionReminderNotificationsSetting(),
      );

      await act(async () => {
        await result.current.setSessionRemindersEnabled(true);
      });

      expect(mockRequestPermission).toHaveBeenCalledTimes(1);
      expect(mockRemoveTriggerNotifications).toHaveBeenCalledTimes(0);
      expect(useUserState.getState()).toEqual(
        expect.objectContaining({
          userState: {'some-uid': {sessionReminderNotifications: true}},
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

      const {result} = renderHook(() =>
        useSessionReminderNotificationsSetting(),
      );

      await act(async () => {
        await result.current.setSessionRemindersEnabled(false);
      });

      expect(mockRequestPermission).toHaveBeenCalledTimes(0);
      expect(mockRemoveTriggerNotifications).toHaveBeenCalledTimes(1);
      expect(mockRemoveTriggerNotifications).toHaveBeenCalledWith('session-reminder'');
      expect(useUserState.getState()).toEqual(
        expect.objectContaining({
          userState: {'some-uid': {sessionReminderNotifications: false}},
        }),
      );
      expect(useNotificationsState.getState()).toEqual(
        expect.objectContaining({notifications: {}}),
      );
    });
  });
});

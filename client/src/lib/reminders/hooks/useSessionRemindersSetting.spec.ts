import {act, renderHook} from '@testing-library/react-hooks';

import useUserState from '../../user/state/state';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import useSessionRemindersSetting from './useSessionRemindersSetting';

const mockRequestPermission = jest.fn();
const mockCheckPermission = jest.fn();
jest.mock('../../notifications/hooks/useNotificationPermissions', () =>
  jest.fn(() => ({
    requestPermission: mockRequestPermission,
    checkPermission: mockCheckPermission,
  })),
);

const mockRemoveTriggerNotifications = jest.fn();
jest.mock('../../notifications/hooks/useTriggerNotifications', () =>
  jest.fn(() => ({
    removeTriggerNotifications: mockRemoveTriggerNotifications,
  })),
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSessionRemindersSetting', () => {
  describe('sessionRemindersEnabled', () => {
    it('is enabled if having permission and sessionReminderNotifications = true', async () => {
      mockCheckPermission.mockResolvedValueOnce(true);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {sessionReminderNotifications: true}},
      });

      const {result} = renderHook(() => useSessionRemindersSetting());

      expect(mockCheckPermission).toHaveBeenCalledTimes(1);
      expect(result.current.sessionRemindersEnabled).toBe(true);
    });

    it('is disabled if sessionReminderNotifications == false', async () => {
      mockCheckPermission.mockResolvedValueOnce(true);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {sessionReminderNotifications: false}},
      });

      const {result} = renderHook(() => useSessionRemindersSetting());

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
        useSessionRemindersSetting(),
      );

      await waitForNextUpdate();

      expect(mockCheckPermission).toHaveBeenCalledTimes(1);
      expect(result.current.sessionRemindersEnabled).toBe(false);
    });

    it('is undefined if sessionReminderNotifications == undefined', async () => {
      mockCheckPermission.mockResolvedValueOnce(true);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {sessionReminderNotifications: undefined}},
      });

      const {result} = renderHook(() => useSessionRemindersSetting());

      expect(mockCheckPermission).toHaveBeenCalledTimes(1);
      expect(result.current.sessionRemindersEnabled).toBe(undefined);
    });
  });

  describe('setSessionRemindersEnabled', () => {
    it('requests permission and sets sessionReminderNotifications to true', async () => {
      mockRequestPermission.mockResolvedValueOnce(undefined);
      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
      });

      const {result} = renderHook(() => useSessionRemindersSetting());

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

    it('clears all notifications and set sessionReminderNotifications to false', async () => {
      mockRequestPermission.mockResolvedValueOnce(undefined);
      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
      });

      const {result} = renderHook(() => useSessionRemindersSetting());

      await act(async () => {
        await result.current.setSessionRemindersEnabled(false);
      });

      expect(mockRequestPermission).toHaveBeenCalledTimes(0);
      expect(mockRemoveTriggerNotifications).toHaveBeenCalledTimes(1);
      expect(mockRemoveTriggerNotifications).toHaveBeenCalledWith(
        'session-reminders',
      );
      expect(useUserState.getState()).toEqual(
        expect.objectContaining({
          userState: {'some-uid': {sessionReminderNotifications: false}},
        }),
      );
    });
  });
});

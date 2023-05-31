import {act, renderHook} from '@testing-library/react-hooks';

import useUserState from '../../user/state/state';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {IntervalEnum} from '../../user/types/Interval';
import usePracticeReminderNotificationsSetting from './usePracticeReminderNotificationsSetting';

const mockRequestPermission = jest.fn();
const mockCheckPermission = jest.fn();
jest.mock('./useNotificationPermissions', () =>
  jest.fn(() => ({
    requestPermission: mockRequestPermission,
    checkPermission: mockCheckPermission,
  })),
);

const mockUpdatePracticeNotifications = jest.fn();
jest.mock('../../schedulers/useUpdatePracticeNotifications', () =>
  jest.fn(() => ({
    updatePracticeNotifications: mockUpdatePracticeNotifications,
  })),
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('usePracticeReminderNotificationsSetting', () => {
  describe('practiceRemindersEnabled', () => {
    it('is enabled if having permission and practiceReminderConfig is set', async () => {
      mockCheckPermission.mockResolvedValueOnce(true);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {
          'some-uid': {
            practiceReminderConfig: {
              interval: IntervalEnum.monday,
              hour: 10,
              minute: 0,
            },
          },
        },
      });

      const {result} = renderHook(() =>
        usePracticeReminderNotificationsSetting(),
      );

      expect(mockCheckPermission).toHaveBeenCalledTimes(1);
      expect(result.current.practiceRemindersEnabled).toBe(true);
    });

    it('is disabled if practiceReminderConfig == null', async () => {
      mockCheckPermission.mockResolvedValueOnce(true);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {practiceReminderConfig: null}},
      });

      const {result} = renderHook(() =>
        usePracticeReminderNotificationsSetting(),
      );

      expect(mockCheckPermission).toHaveBeenCalledTimes(1);
      expect(result.current.practiceRemindersEnabled).toBe(false);
    });

    it('is disabled if not having permission', async () => {
      mockCheckPermission.mockResolvedValueOnce(false);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {
          'some-uid': {
            practiceReminderConfig: {
              interval: IntervalEnum.monday,
              hour: 10,
              minute: 0,
            },
          },
        },
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        usePracticeReminderNotificationsSetting(),
      );

      await waitForNextUpdate();

      expect(mockCheckPermission).toHaveBeenCalledTimes(1);
      expect(result.current.practiceRemindersEnabled).toBe(false);
    });

    it('is undefined if practiceReminderConfig == undefined', async () => {
      mockCheckPermission.mockResolvedValueOnce(true);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {practiceReminderConfig: undefined}},
      });

      const {result} = renderHook(() =>
        usePracticeReminderNotificationsSetting(),
      );

      expect(mockCheckPermission).toHaveBeenCalledTimes(1);
      expect(result.current.practiceRemindersEnabled).toBe(undefined);
    });
  });

  describe('setPracticeRemindersEnabled', () => {
    it('requests permission and sets practiceReminderConfig', async () => {
      mockRequestPermission.mockResolvedValueOnce(undefined);
      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
      });

      const {result} = renderHook(() =>
        usePracticeReminderNotificationsSetting(),
      );

      await act(async () => {
        await result.current.setPracticeRemindersEnabled({
          interval: IntervalEnum.monday,
          hour: 10,
          minute: 0,
        });
      });

      expect(mockRequestPermission).toHaveBeenCalledTimes(1);
      expect(mockUpdatePracticeNotifications).toHaveBeenCalledTimes(1);
      expect(mockUpdatePracticeNotifications).toHaveBeenCalledWith({
        interval: IntervalEnum.monday,
        hour: 10,
        minute: 0,
      });
      expect(useUserState.getState()).toEqual(
        expect.objectContaining({
          userState: {
            'some-uid': {
              practiceReminderConfig: {
                interval: IntervalEnum.monday,
                hour: 10,
                minute: 0,
              },
            },
          },
        }),
      );
    });

    it('clears all notifications and set practiceReminderConfig to null', async () => {
      mockRequestPermission.mockResolvedValueOnce(undefined);
      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
      });

      const {result} = renderHook(() =>
        usePracticeReminderNotificationsSetting(),
      );

      await act(async () => {
        await result.current.setPracticeRemindersEnabled(null);
      });

      expect(mockRequestPermission).toHaveBeenCalledTimes(0);
      expect(mockUpdatePracticeNotifications).toHaveBeenCalledTimes(1);
      expect(mockUpdatePracticeNotifications).toHaveBeenCalledWith(null);
      expect(useUserState.getState()).toEqual(
        expect.objectContaining({
          userState: {'some-uid': {practiceReminderConfig: null}},
        }),
      );
    });
  });
});

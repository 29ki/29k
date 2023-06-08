import {act, renderHook} from '@testing-library/react-hooks';

import useUserState from '../../user/state/state';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import usePracticeRemindersSetting from './usePracticeRemindersSetting';
import {REMINDER_INTERVALS} from '../constants';

const mockRequestPermission = jest.fn();
const mockCheckPermission = jest.fn();
jest.mock('../../notifications/hooks/useNotificationPermissions', () =>
  jest.fn(() => ({
    requestPermission: mockRequestPermission,
    checkPermission: mockCheckPermission,
  })),
);

const mockUpdatePracticeNotifications = jest.fn();
jest.mock('./useUpdatePracticeReminders', () =>
  jest.fn(() => ({
    updatePracticeNotifications: mockUpdatePracticeNotifications,
  })),
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('usePracticeRemindersSetting', () => {
  describe('practiceRemindersEnabled', () => {
    it('is enabled if having permission and practiceReminderConfig is set', async () => {
      mockCheckPermission.mockResolvedValueOnce(true);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {
          'some-uid': {
            practiceReminderConfig: {
              hour: 0,
              minute: 0,
              interval: REMINDER_INTERVALS.DAILY,
            },
          },
        },
      });

      const {result} = renderHook(() => usePracticeRemindersSetting());

      expect(mockCheckPermission).toHaveBeenCalledTimes(1);
      expect(result.current.practiceRemindersEnabled).toBe(true);
    });

    it('is disabled if practiceReminderConfig == null', async () => {
      mockCheckPermission.mockResolvedValueOnce(true);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {practiceReminderConfig: null}},
      });

      const {result} = renderHook(() => usePracticeRemindersSetting());

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
              hour: 0,
              minute: 0,
              interval: REMINDER_INTERVALS.DAILY,
            },
          },
        },
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        usePracticeRemindersSetting(),
      );

      await act(async () => {
        await waitForNextUpdate();

        expect(mockCheckPermission).toHaveBeenCalledTimes(1);
        expect(result.current.practiceRemindersEnabled).toBe(false);
      });
    });

    it('is undefined if practiceReminderConfig == undefined', async () => {
      mockCheckPermission.mockResolvedValueOnce(true);

      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {}},
      });

      const {result} = renderHook(() => usePracticeRemindersSetting());

      expect(mockCheckPermission).toHaveBeenCalledTimes(1);
      expect(result.current.practiceRemindersEnabled).toBe(undefined);
    });
  });

  describe('practiceReminderConfig', () => {
    it('can be set', async () => {
      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {
          'some-uid': {
            practiceReminderConfig: {
              hour: 0,
              minute: 0,
              interval: REMINDER_INTERVALS.DAILY,
            },
          },
        },
      });

      await act(async () => {
        const {result, waitForNextUpdate} = renderHook(() =>
          usePracticeRemindersSetting(),
        );
        await waitForNextUpdate();
        expect(result.current.practiceReminderConfig).toEqual({
          hour: 0,
          minute: 0,
          interval: REMINDER_INTERVALS.DAILY,
        });
      });
    });

    it('can be null', async () => {
      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {practiceReminderConfig: null}},
      });

      await act(async () => {
        const {result, waitForNextUpdate} = renderHook(() =>
          usePracticeRemindersSetting(),
        );
        await waitForNextUpdate();
        expect(result.current.practiceReminderConfig).toBe(null);
      });
    });

    it('can be undefined', async () => {
      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
        userState: {'some-uid': {}},
      });

      const {result} = renderHook(() => usePracticeRemindersSetting());

      expect(result.current.practiceReminderConfig).toBe(undefined);
    });
  });

  describe('setPracticeRemindersConfig', () => {
    it('requests permission and sets practiceReminderConfig is set', async () => {
      mockRequestPermission.mockResolvedValueOnce(undefined);
      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
      });

      const {result} = renderHook(() => usePracticeRemindersSetting());

      await act(async () => {
        await result.current.setPracticeRemindersConfig({
          hour: 0,
          minute: 0,
          interval: REMINDER_INTERVALS.DAILY,
        });
      });

      expect(mockRequestPermission).toHaveBeenCalledTimes(1);
      expect(mockUpdatePracticeNotifications).toHaveBeenCalledTimes(1);
      expect(mockUpdatePracticeNotifications).toHaveBeenCalledWith({
        hour: 0,
        minute: 0,
        interval: REMINDER_INTERVALS.DAILY,
      });
      expect(useUserState.getState()).toEqual(
        expect.objectContaining({
          userState: {
            'some-uid': {
              practiceReminderConfig: {
                hour: 0,
                minute: 0,
                interval: REMINDER_INTERVALS.DAILY,
              },
            },
          },
        }),
      );
    });

    it('clears all notifications and set practiceReminderConfig is set to null', async () => {
      mockRequestPermission.mockResolvedValueOnce(undefined);
      useUserState.setState({
        user: {uid: 'some-uid'} as FirebaseAuthTypes.User,
      });

      const {result} = renderHook(() => usePracticeRemindersSetting());

      await act(async () => {
        await result.current.setPracticeRemindersConfig(null);
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

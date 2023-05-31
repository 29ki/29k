import {act, renderHook} from '@testing-library/react-hooks';
import notifee, {
  TriggerNotification,
  Notification,
} from '@notifee/react-native';

import useTriggerNotifications from './useTriggerNotifications';
import useNotificationsState from '../state/state';
import {NOTIFICATION_CHANNELS} from '../constants';

const mockCreateTriggerNotification =
  notifee.createTriggerNotification as jest.Mock;
const mockGetTriggerNotifications =
  notifee.getTriggerNotifications as jest.Mock;
const mockCancelTriggerNotification =
  notifee.cancelTriggerNotification as jest.Mock;

const mockRequestPermission = jest.fn().mockResolvedValue(undefined);
jest.mock('./useNotificationPermissions', () =>
  jest.fn(() => ({
    requestPermission: mockRequestPermission,
  })),
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useTriggerNotifications', () => {
  describe('getTriggerNotification', () => {
    it('sets a trigger notification', async () => {
      const {result} = renderHook(() => useTriggerNotifications());

      const timestamp = new Date().getTime() + 10000;

      await act(async () => {
        await result.current.setTriggerNotification(
          'some-id',
          NOTIFICATION_CHANNELS.SESSION_REMINDERS,
          'Some title',
          'Some body',
          'http://some.deep/link',
          'http://some/image.png',
          timestamp,
        );
      });

      expect(mockRequestPermission).toHaveBeenCalledTimes(1);
      expect(useNotificationsState.getState()).toEqual(
        expect.objectContaining({
          notifications: {
            'some-id': {
              id: 'some-id',
              title: 'Some title',
              body: 'Some body',
              data: {
                channelId: 'session-reminders',
                url: 'http://some.deep/link',
              },
            },
          },
        }),
      );
      expect(mockCreateTriggerNotification).toHaveBeenCalledTimes(1);
      expect(mockCreateTriggerNotification).toHaveBeenCalledWith(
        {
          android: {
            channelId: 'session-reminders',
            importance: 4,
            largeIcon: 'http://some/image.png',
          },
          body: 'Some body',
          data: {
            channelId: 'session-reminders',
            url: 'http://some.deep/link',
          },
          id: 'some-id',
          ios: {
            attachments: [{url: 'http://some/image.png'}],
            interruptionLevel: 'timeSensitive',
          },
          title: 'Some title',
        },
        {
          timestamp,
          type: 0,
        },
      );
    });

    it('does not set notifications for dates in the past', async () => {
      const {result} = renderHook(() => useTriggerNotifications());

      await act(async () => {
        await result.current.setTriggerNotification(
          'some-id',
          NOTIFICATION_CHANNELS.SESSION_REMINDERS,
          'Some title',
          'Some body',
          'http://some.deep/link',
          'http://some/image.png',
          new Date().getTime() - 10000,
        );
      });

      expect(mockRequestPermission).toHaveBeenCalledTimes(0);
      expect(useNotificationsState.getState()).toEqual(
        expect.objectContaining({
          notifications: {},
        }),
      );
      expect(mockCreateTriggerNotification).toHaveBeenCalledTimes(0);
    });
  });

  describe('removeTriggerNotification', () => {
    it('removes a notification', async () => {
      useNotificationsState.setState({
        notifications: {
          'some-id': {},
        },
      });
      const {result} = renderHook(() => useTriggerNotifications());

      await act(async () => {
        await result.current.removeTriggerNotification('some-id');
      });

      expect(useNotificationsState.getState()).toEqual(
        expect.objectContaining({
          notifications: {},
        }),
      );
      expect(mockCancelTriggerNotification).toHaveBeenCalledTimes(1);
      expect(mockCancelTriggerNotification).toHaveBeenCalledWith('some-id');
    });
  });

  describe('removeTriggerNotifications', () => {
    it('removes all notifications', async () => {
      mockGetTriggerNotifications.mockResolvedValueOnce([
        {notification: {id: 'some-id'} as Notification},
        {notification: {id: 'some-other-id'} as Notification},
      ]);
      useNotificationsState.setState({
        notifications: {
          'some-id': {},
          'some-other-id': {},
        },
      });
      const {result} = renderHook(() => useTriggerNotifications());

      await act(async () => {
        await result.current.removeTriggerNotifications();
      });

      expect(mockGetTriggerNotifications).toHaveBeenCalledTimes(1);
      expect(mockCancelTriggerNotification).toHaveBeenCalledTimes(2);
      expect(mockCancelTriggerNotification).toHaveBeenCalledWith('some-id');
      expect(mockCancelTriggerNotification).toHaveBeenCalledWith(
        'some-other-id',
      );
      expect(useNotificationsState.getState()).toEqual(
        expect.objectContaining({
          notifications: {},
        }),
      );
    });

    it('removes all notifications by channelId', async () => {
      mockGetTriggerNotifications.mockResolvedValueOnce([
        {
          notification: {
            id: 'some-id',
            data: {
              channelId: 'session-reminders',
            },
          } as Notification,
        },
        {
          notification: {
            id: 'some-other-id',
            data: {
              channelId: 'practice-reminders',
            },
          } as Notification,
        },
      ]);
      useNotificationsState.setState({
        notifications: {
          'some-id': {},
          'some-other-id': {},
        },
      });
      const {result} = renderHook(() => useTriggerNotifications());

      await act(async () => {
        await result.current.removeTriggerNotifications(
          NOTIFICATION_CHANNELS.SESSION_REMINDERS,
        );
      });

      expect(mockGetTriggerNotifications).toHaveBeenCalledTimes(1);
      expect(mockCancelTriggerNotification).toHaveBeenCalledTimes(1);
      expect(mockCancelTriggerNotification).toHaveBeenCalledWith('some-id');
      expect(useNotificationsState.getState()).toEqual(
        expect.objectContaining({
          notifications: {'some-other-id': {}},
        }),
      );
    });
  });
});

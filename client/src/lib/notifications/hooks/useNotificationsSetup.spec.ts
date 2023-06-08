import {act, renderHook} from '@testing-library/react-hooks';
import notifee, {
  EventType,
  Event,
  TriggerNotification,
} from '@notifee/react-native';
import {AppState} from 'react-native';

import useNotificationsSetup from './useNotificationsSetup';
import useNotificationsState from '../state/state';

const mockGetTriggerNotifications =
  notifee.getTriggerNotifications as jest.Mock;
const mockAddEventListener = AppState.addEventListener as jest.Mock;
const mockOnForegroundEvent = notifee.onForegroundEvent as jest.Mock;
const mockCreateChannel = notifee.createChannel as jest.Mock;

mockAddEventListener.mockImplementation(() => {
  return {remove: jest.fn()};
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('useNotificationsSetup', () => {
  describe('channels', () => {
    it('creates channels on mount', async () => {
      renderHook(() => useNotificationsSetup());

      expect(mockCreateChannel).toHaveBeenCalledTimes(2);
      expect(mockCreateChannel).toHaveBeenCalledWith({
        id: 'session-reminders',
        importance: 4,
        name: 'session-reminders',
      });
      expect(mockCreateChannel).toHaveBeenCalledWith({
        id: 'practice-reminders',
        importance: 4,
        name: 'practice-reminders',
      });
    });
  });

  describe('mount', () => {
    it('sets notificationState on mount', async () => {
      const useTestHook = () => {
        // Wrapper to make the hook react to changes
        useNotificationsSetup();
        return useNotificationsState(state => state.notifications);
      };

      mockGetTriggerNotifications.mockResolvedValueOnce([
        {notification: {id: 'some-id'}} as TriggerNotification,
        {notification: {id: 'some-other-id'}} as TriggerNotification,
      ]);

      const {result, waitForNextUpdate} = renderHook(() => useTestHook());
      await waitForNextUpdate();

      expect(mockGetTriggerNotifications).toHaveBeenCalledTimes(1);
      expect(result.current).toEqual({
        'some-id': {id: 'some-id'},
        'some-other-id': {id: 'some-other-id'},
      });
    });
  });

  describe('onForegroundEvent', () => {
    it('adds notification on TRIGGER_NOTIFICATION_CREATED', async () => {
      mockGetTriggerNotifications.mockResolvedValue([
        {notification: {id: 'some-id'}} as TriggerNotification,
      ]);

      type EventCallback = (event?: Event) => Promise<void>;
      let eventCallback: EventCallback = () => Promise.resolve();
      mockOnForegroundEvent
        .mockImplementationOnce(callback => {
          eventCallback = callback;
        })
        .mockImplementationOnce(callback => {
          callback();
        });

      renderHook(() => useNotificationsSetup());

      await act(async () => {
        await eventCallback({
          type: EventType.TRIGGER_NOTIFICATION_CREATED,
          detail: {notification: {id: 'some-id'}},
        });
      });

      expect(mockGetTriggerNotifications).toHaveBeenCalledTimes(2);
      expect(useNotificationsState.getState()).toEqual(
        expect.objectContaining({
          notifications: {'some-id': {id: 'some-id'}},
        }),
      );
    });

    it('updates all notifications', async () => {
      mockGetTriggerNotifications
        .mockResolvedValueOnce([
          {notification: {id: 'some-id'}} as TriggerNotification,
          {notification: {id: 'some-other-id'}} as TriggerNotification,
        ])
        .mockResolvedValueOnce([
          {
            notification: {id: 'some-id', title: 'some title'},
          } as TriggerNotification,
          {
            notification: {id: 'some-other-id', title: 'some other title'},
          } as TriggerNotification,
        ]);

      type EventCallback = (event?: Event) => Promise<void>;
      let eventCallback: EventCallback = () => Promise.resolve();
      mockOnForegroundEvent
        .mockImplementationOnce(callback => {
          eventCallback = callback;
        })
        .mockImplementationOnce(callback => {
          callback();
        });

      renderHook(() => useNotificationsSetup());

      await act(async () => {
        await eventCallback({
          type: EventType.TRIGGER_NOTIFICATION_CREATED,
          detail: {notification: {id: 'some-id'}},
        });
      });

      expect(mockGetTriggerNotifications).toHaveBeenCalledTimes(2);
      expect(useNotificationsState.getState()).toEqual(
        expect.objectContaining({
          notifications: {
            'some-id': {id: 'some-id', title: 'some title'},
            'some-other-id': {id: 'some-other-id', title: 'some other title'},
          },
        }),
      );
    });

    it('removes notification on DELIVERED', async () => {
      useNotificationsState.setState({
        notifications: {'some-id': {id: 'some-id'}},
      });

      mockGetTriggerNotifications
        .mockResolvedValueOnce([
          {notification: {id: 'some-id'}} as TriggerNotification,
        ])
        .mockResolvedValueOnce([]);

      type EventCallback = (event?: Event) => Promise<void>;
      let eventCallback: EventCallback = () => Promise.resolve();
      mockOnForegroundEvent
        .mockImplementationOnce(callback => {
          eventCallback = callback as EventCallback;
        })
        .mockImplementationOnce(callback => {
          callback();
        });

      renderHook(() => useNotificationsSetup());

      expect(useNotificationsState.getState()).toEqual(
        expect.objectContaining({
          notifications: {'some-id': {id: 'some-id'}},
        }),
      );

      await act(async () => {
        await eventCallback({
          type: EventType.DELIVERED,
          detail: {notification: {id: 'some-id'}},
        });
      });

      expect(useNotificationsState.getState()).toEqual(
        expect.objectContaining({
          notifications: {},
        }),
      );
    });

    it('unsubscribes from onForegroundEvent on unmount', async () => {
      const mockUnsubscribe = jest.fn();
      mockOnForegroundEvent.mockImplementation(() => mockUnsubscribe);

      const {unmount} = renderHook(() => useNotificationsSetup());

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalledTimes(2);
    });
  });

  describe('resumeFromBackgrounded', () => {
    it('updates all notifications on resume', async () => {
      useNotificationsState.setState({
        notifications: {'some-id': {id: 'some-id'}},
      });

      AppState.currentState = 'background';

      mockGetTriggerNotifications.mockResolvedValue([
        {notification: {id: 'some-other-id'}},
      ]);

      let eventCallback = (_: string) => Promise.resolve();
      mockAddEventListener.mockImplementationOnce((_, callback) => {
        eventCallback = callback;
        return {remove: jest.fn()};
      });

      renderHook(() => useNotificationsSetup());

      await act(async () => {
        await eventCallback('active');
      });

      expect(mockGetTriggerNotifications).toHaveBeenCalledTimes(2);
      expect(useNotificationsState.getState()).toEqual(
        expect.objectContaining({
          notifications: {'some-other-id': {id: 'some-other-id'}},
        }),
      );
    });
  });
});

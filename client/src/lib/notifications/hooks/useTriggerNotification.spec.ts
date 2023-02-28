import {act, renderHook} from '@testing-library/react-hooks';
import notifee, {
  EventType,
  Event,
  TriggerNotification,
} from '@notifee/react-native';
import {AppState} from 'react-native';

import useTriggerNotification from './useTriggerNotification';
import useNotificationsState from '../state/state';
import useRequestNotificationPermission from './useRequestNotificationPermission';

jest.mock('./useRequestNotificationPermission');

const mockCreateTriggerNotification =
  notifee.createTriggerNotification as jest.Mock;
const mockGetTriggerNotifications =
  notifee.getTriggerNotifications as jest.Mock;
const mockCancelTriggerNotification =
  notifee.cancelTriggerNotification as jest.Mock;
const mockAddEventListener = AppState.addEventListener as jest.Mock;
const mockOnForegroundEvent = notifee.onForegroundEvent as jest.Mock;

mockAddEventListener.mockImplementation(() => {
  return {remove: jest.fn()};
});

const mockRequestPermission = jest.fn().mockResolvedValue(undefined);
jest
  .mocked(useRequestNotificationPermission)
  .mockReturnValue(mockRequestPermission);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useTriggerNotification', () => {
  it('sets a trigger notification', async () => {
    mockGetTriggerNotifications.mockResolvedValueOnce([
      {notification: {id: 'some-id'}} as TriggerNotification,
    ]);

    const {result, waitForNextUpdate} = renderHook(() =>
      useTriggerNotification('some-id'),
    );

    await waitForNextUpdate();

    const timestamp = new Date().getTime() + 10000;

    await act(async () => {
      await result.current.setTriggerNotification(
        'Some title',
        'Some body',
        'http://some.deep/link',
        timestamp,
      );
    });

    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
    expect(result.current.triggerNotification).toMatchObject({id: 'some-id'});
    expect(mockCreateTriggerNotification).toHaveBeenCalledTimes(1);
    expect(mockCreateTriggerNotification).toHaveBeenCalledWith(
      {
        id: 'some-id',
        title: 'Some title',
        body: 'Some body',
        android: {
          channelId: 'reminders',
        },
        data: {
          url: 'http://some.deep/link',
        },
      },
      {
        type: 0,
        timestamp,
      },
    );

    expect(result.all.length).toBe(3);
  });

  it('does not set reminders for dates in the past', async () => {
    const {result} = renderHook(() => useTriggerNotification('some-id'));

    await act(async () => {
      await result.current.setTriggerNotification(
        'Some title',
        'Some body',
        'http://some.deep/link',
        new Date().getTime() - 10000,
      );
    });

    expect(mockRequestPermission).toHaveBeenCalledTimes(0);
    expect(result.current.triggerNotification).toBe(undefined);
    expect(mockCreateTriggerNotification).toHaveBeenCalledTimes(0);
  });

  it('supports removing the notification', async () => {
    mockGetTriggerNotifications.mockResolvedValueOnce([
      {notification: {id: 'some-id'}} as TriggerNotification,
    ]);

    const {result, waitForNextUpdate} = renderHook(() =>
      useTriggerNotification('some-id'),
    );

    await waitForNextUpdate();

    expect(result.current.triggerNotification).toEqual({id: 'some-id'});

    await act(async () => {
      await result.current.removeTriggerNotification();
    });

    expect(result.current.triggerNotification).toBe(undefined);

    expect(mockCancelTriggerNotification).toHaveBeenCalledTimes(1);
    expect(mockCancelTriggerNotification).toHaveBeenCalledWith('some-id');

    expect(result.all.length).toBe(3);
  });

  it('supports removing the notification on resume', async () => {
    AppState.currentState = 'background';
    mockGetTriggerNotifications
      .mockResolvedValueOnce([
        {notification: {id: 'some-id'}} as TriggerNotification,
      ])
      .mockResolvedValueOnce([]);

    let eventCallback = (_: string) => Promise.resolve();
    mockAddEventListener.mockImplementationOnce((_, callback) => {
      eventCallback = callback;
      return {remove: jest.fn()};
    });

    const {result, waitForNextUpdate} = renderHook(() =>
      useTriggerNotification('some-id'),
    );

    await waitForNextUpdate();

    expect(result.current.triggerNotification).toEqual({id: 'some-id'});

    await act(async () => {
      await eventCallback('active');
    });

    expect(result.current.triggerNotification).toBe(undefined);

    expect(result.all.length).toBe(3);
  });

  it('adds notification on TRIGGER_NOTIFICATION_CREATED', async () => {
    mockGetTriggerNotifications.mockResolvedValue([
      {notification: {id: 'some-id'}} as TriggerNotification,
    ]);

    type EventCallback = (event?: Event) => Promise<void>;
    let eventCallback: EventCallback = () => Promise.resolve();
    mockOnForegroundEvent.mockImplementation(callback => {
      eventCallback = callback;
    });

    const {result} = renderHook(() => useTriggerNotification('some-id'));

    await act(async () => {
      await eventCallback({
        type: EventType.TRIGGER_NOTIFICATION_CREATED,
        detail: {notification: {id: 'some-id'}},
      });
    });

    expect(result.current.triggerNotification).toEqual({id: 'some-id'});
  });

  it('removes notification on DELIVERED', async () => {
    useNotificationsState.setState({
      notifications: {'some-id': {id: 'some-id'}},
    });

    mockGetTriggerNotifications.mockResolvedValue([]);

    type EventCallback = (event?: Event) => Promise<void>;
    let eventCallback: EventCallback = () => Promise.resolve();
    mockOnForegroundEvent.mockImplementation(callback => {
      eventCallback = callback as EventCallback;
    });

    const {result} = renderHook(() => useTriggerNotification('some-id'));

    expect(result.current.triggerNotification).toEqual({id: 'some-id'});

    await act(async () => {
      await eventCallback({
        type: EventType.DELIVERED,
        detail: {notification: {id: 'some-id'}},
      });
    });

    expect(result.current.triggerNotification).toBe(undefined);
  });

  it('unsubscribes from onForegroundEvent on unmount', async () => {
    const mockUnsubscribe = jest.fn();
    mockOnForegroundEvent.mockImplementation(() => mockUnsubscribe);

    const {unmount} = renderHook(() => useTriggerNotification('some-id'));

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});

import {act, renderHook} from '@testing-library/react-hooks';
import notifee, {EventType, Event} from '@notifee/react-native';

import useTriggerNotification from './useTriggerNotification';

const mockCreateTriggerNotification =
  notifee.createTriggerNotification as jest.Mock;
const mockGetTriggerNotifications =
  notifee.getTriggerNotifications as jest.Mock;
const mockOnForegroundEvent = notifee.onForegroundEvent as jest.Mock;
const mockRequestPermission = notifee.requestPermission as jest.Mock;
const mockCancelTriggerNotification =
  notifee.cancelTriggerNotification as jest.Mock;

afterEach(() => {
  jest.resetAllMocks();
});

describe('useTriggerNotification', () => {
  it('sets a trigger notification', async () => {
    mockCreateTriggerNotification.mockReturnValueOnce('some-id');

    const {result} = renderHook(() => useTriggerNotification('some-id'));

    const notificationId = await result.current.setTriggerNotification(
      'Some title',
      'Some body',
      123456789,
    );

    expect(notificationId).toBe('some-id');
    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
    expect(mockCreateTriggerNotification).toHaveBeenCalledTimes(1);
    expect(mockCreateTriggerNotification).toHaveBeenCalledWith(
      {
        id: 'some-id',
        title: 'Some title',
        body: 'Some body',
        android: {
          channelId: 'reminders',
        },
      },
      {
        type: 0,
        timestamp: 123456789,
      },
    );

    expect(result.all.length).toBe(1);
  });

  it('gets any existing trigger notification on mount', async () => {
    mockGetTriggerNotifications.mockReturnValueOnce([
      {notification: {id: 'some-id'}},
      {notification: {id: 'some-other-id'}},
    ]);

    const {result, waitForNextUpdate} = renderHook(() =>
      useTriggerNotification('some-id'),
    );

    await waitForNextUpdate();

    expect(result.current.triggerNotification).toEqual({id: 'some-id'});

    expect(mockGetTriggerNotifications).toHaveBeenCalledTimes(1);

    expect(result.all.length).toBe(2);
  });

  it('subscribes to TRIGGER_NOTIFICATION_CREATED events for the set id', async () => {
    let eventCallback: (event: Event) => void = () => {};
    mockOnForegroundEvent.mockImplementationOnce(callback => {
      eventCallback = callback;
    });

    const {result} = renderHook(() => useTriggerNotification('some-id'));

    expect(result.current.triggerNotification).toBe(undefined);

    expect(mockOnForegroundEvent).toHaveBeenCalledTimes(1);

    act(() => {
      eventCallback({
        type: EventType.TRIGGER_NOTIFICATION_CREATED,
        detail: {notification: {id: 'some-id'}},
      });
    });

    expect(result.current.triggerNotification).toEqual({id: 'some-id'});

    expect(result.all.length).toBe(2);
  });

  it('subscribes to DELIVERED events for the set id', async () => {
    mockGetTriggerNotifications.mockReturnValueOnce([
      {notification: {id: 'some-id'}},
    ]);

    let eventCallback: (event: Event) => void = () => {};
    mockOnForegroundEvent.mockImplementationOnce(callback => {
      eventCallback = callback;
    });

    const {result, waitForNextUpdate} = renderHook(() =>
      useTriggerNotification('some-id'),
    );

    await waitForNextUpdate();

    expect(result.current.triggerNotification).toEqual({id: 'some-id'});

    expect(mockOnForegroundEvent).toHaveBeenCalledTimes(1);

    act(() => {
      eventCallback({
        type: EventType.DELIVERED,
        detail: {notification: {id: 'some-id'}},
      });
    });

    expect(result.current.triggerNotification).toBe(undefined);

    expect(result.all.length).toBe(3);
  });

  it("doesn't require an id to be set", async () => {
    let eventCallback: (event: Event) => void = () => {};
    mockOnForegroundEvent.mockImplementationOnce(callback => {
      eventCallback = callback;
    });
    mockCreateTriggerNotification.mockReturnValueOnce('some-generated-id');

    const {result} = renderHook(() => useTriggerNotification());

    expect(result.current.triggerNotification).toBe(undefined);

    await result.current.setTriggerNotification(
      'Some title',
      'Some body',
      123456789,
    );

    act(() => {
      eventCallback({
        type: EventType.TRIGGER_NOTIFICATION_CREATED,
        detail: {notification: {id: 'some-generated-id'}},
      });
    });

    expect(result.current.triggerNotification).toEqual({
      id: 'some-generated-id',
    });

    expect(result.all.length).toBe(2);
  });

  it('supports removing the notification', async () => {
    mockGetTriggerNotifications.mockReturnValueOnce([
      {notification: {id: 'some-id'}},
    ]);

    const {result, waitForNextUpdate} = renderHook(() =>
      useTriggerNotification('some-id'),
    );

    await waitForNextUpdate();

    expect(result.current.triggerNotification).toEqual({id: 'some-id'});

    result.current.removeTriggerNotification();

    await waitForNextUpdate();

    expect(result.current.triggerNotification).toBe(undefined);

    expect(mockCancelTriggerNotification).toHaveBeenCalledTimes(1);
    expect(mockCancelTriggerNotification).toHaveBeenCalledWith('some-id');

    expect(result.all.length).toBe(3);
  });

  it('unsubscribes from notification events on unmount', async () => {
    const mockUnsubscribe = jest.fn();
    mockOnForegroundEvent.mockImplementationOnce(() => mockUnsubscribe);

    const {unmount} = renderHook(() => useTriggerNotification());

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});

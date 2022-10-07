import {act, renderHook} from '@testing-library/react-hooks';
import notifee from '@notifee/react-native';

import useTriggerNotification from './useTriggerNotification';
import {RecoilRoot} from 'recoil';
import {AppState} from 'react-native';

const mockCreateTriggerNotification =
  notifee.createTriggerNotification as jest.Mock;
const mockGetTriggerNotifications =
  notifee.getTriggerNotifications as jest.Mock;
const mockRequestPermission = notifee.requestPermission as jest.Mock;
const mockCancelTriggerNotification =
  notifee.cancelTriggerNotification as jest.Mock;
const mockAddEventListener = AppState.addEventListener as jest.Mock;

mockAddEventListener.mockImplementation(() => {
  return {remove: jest.fn()};
});

describe('useTriggerNotification', () => {
  it('sets a trigger notification', async () => {
    mockGetTriggerNotifications.mockResolvedValueOnce([
      {notification: {id: 'some-id'}},
    ]);

    const {result, waitForNextUpdate} = renderHook(
      () => useTriggerNotification('some-id'),
      {
        wrapper: RecoilRoot,
      },
    );

    await waitForNextUpdate();

    await act(async () => {
      await result.current.setTriggerNotification(
        'Some title',
        'Some body',
        123456789,
      );
    });

    expect(result.current.triggerNotification).toMatchObject({id: 'some-id'});
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

    expect(result.all.length).toBe(2);
  });

  it('supports removing the notification', async () => {
    mockGetTriggerNotifications.mockResolvedValueOnce([
      {notification: {id: 'some-other-id'}},
    ]);

    const {result, waitForNextUpdate} = renderHook(
      /*
        Recoil caches selectors between recoil roots - easiest to use a different ID here
        https://recoiljs.org/docs/guides/testing/#clearing-all-selector-caches
      */
      () => useTriggerNotification('some-other-id'),
      {
        wrapper: RecoilRoot,
      },
    );

    await waitForNextUpdate();

    expect(result.current.triggerNotification).toEqual({id: 'some-other-id'});

    await act(async () => {
      await result.current.removeTriggerNotification();
    });

    expect(result.current.triggerNotification).toBe(undefined);

    expect(mockCancelTriggerNotification).toHaveBeenCalledTimes(1);
    expect(mockCancelTriggerNotification).toHaveBeenCalledWith('some-other-id');

    expect(result.all.length).toBe(2);
  });

  it('supports removing the notification on resume', async () => {
    AppState.currentState = 'background';
    mockGetTriggerNotifications
      .mockResolvedValueOnce([{notification: {id: 'some-sent-id'}}])
      .mockResolvedValueOnce([]);

    let eventCallback = (_: string) => Promise.resolve();
    mockAddEventListener.mockImplementationOnce((_, callback) => {
      eventCallback = callback;
      return {remove: jest.fn()};
    });

    const {result, waitForNextUpdate} = renderHook(
      /*
        Recoil caches selectors between recoil roots - easiest to use a different ID here
        https://recoiljs.org/docs/guides/testing/#clearing-all-selector-caches
      */
      () => useTriggerNotification('some-sent-id'),
      {
        wrapper: RecoilRoot,
      },
    );

    await waitForNextUpdate();

    expect(result.current.triggerNotification).toEqual({id: 'some-sent-id'});

    await act(async () => {
      await eventCallback('active');
    });

    expect(result.current.triggerNotification).toBe(undefined);

    expect(result.all.length).toBe(2);
  });
});

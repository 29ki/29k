import {snapshot_UNSTABLE} from 'recoil';
import notifee, {EventType, Event} from '@notifee/react-native';
import {notificationAtom} from './state';

const mockGetTriggerNotifications =
  notifee.getTriggerNotifications as jest.Mock;
const mockOnForegroundEvent = notifee.onForegroundEvent as jest.Mock;

type EventCallback = (event?: Event) => Promise<void>;

// Since recoil somehow keeps state between tests for atomFamiliy
// each test have to create state with uniqe key between tests
describe('notifications - state', () => {
  it('loads initial state', async () => {
    const notification = {id: 'some-id-1'};
    mockGetTriggerNotifications.mockResolvedValueOnce([{notification}]);

    const initialSnapshot = snapshot_UNSTABLE();

    expect(
      await initialSnapshot
        .getLoadable(notificationAtom(notification.id))
        .promiseOrThrow(), // default is a promise, needs to be awaited
    ).toMatchObject(notification);
  });

  it('adds notification to state on TRIGGER_NOTIFICATION_CREATED', async () => {
    const notification = {id: 'some-id-2'};
    mockGetTriggerNotifications
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{notification}]);

    let eventCallback: EventCallback = () => Promise.resolve();
    mockOnForegroundEvent.mockImplementationOnce(callback => {
      eventCallback = callback;
    });

    const initialSnapshot = snapshot_UNSTABLE();
    const state = notificationAtom(notification.id);

    expect(await initialSnapshot.getLoadable(state).promiseOrThrow()).toBe(
      undefined,
    ); // default is a promise, needs to be awaited

    await eventCallback({
      type: EventType.TRIGGER_NOTIFICATION_CREATED,
      detail: {notification},
    });

    expect(initialSnapshot.getLoadable(state).valueOrThrow()).toMatchObject(
      notification,
    ); // next state is not taken from default, can't be awaited
  });

  it('removes notification from state on DELIVERED', async () => {
    const notification = {id: 'some-id-3'};
    mockGetTriggerNotifications
      .mockResolvedValueOnce([{notification}])
      .mockResolvedValueOnce([]);

    let eventCallback: EventCallback = () => Promise.resolve();
    mockOnForegroundEvent.mockImplementationOnce(callback => {
      eventCallback = callback;
    });

    const initialSnapshot = snapshot_UNSTABLE();
    const state = notificationAtom(notification.id);

    expect(
      await initialSnapshot.getLoadable(state).promiseOrThrow(),
    ).toMatchObject(notification); // default is a promise, needs to be awaited

    await eventCallback({
      type: EventType.DELIVERED,
      detail: {notification},
    });

    expect(initialSnapshot.getLoadable(state).valueOrThrow()).toBe(undefined);
    // next state is not taken from default, can't be awaited
  });
});

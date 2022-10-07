import notifee, {EventType, Event} from '@notifee/react-native';
import {snapshot_UNSTABLE} from 'recoil';
import {notificationAtom} from './state';

const mockGetTriggerNotifications =
  notifee.getTriggerNotifications as jest.Mock;
const mockOnForegroundEvent = notifee.onForegroundEvent as jest.Mock;

type EventCallback = (event?: Event) => Promise<void>;

beforeEach(() => jest.resetModules());

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
    const notification = {id: 'some-id-1'};
    mockGetTriggerNotifications.mockResolvedValue([{notification}]);

    let eventCallback: EventCallback = () => Promise.resolve();
    mockOnForegroundEvent.mockImplementationOnce(callback => {
      eventCallback = callback;
    });

    const state = notificationAtom(notification.id);
    const initialSnapshot = snapshot_UNSTABLE(({set}) => {
      set(state, undefined);
    });

    expect(initialSnapshot.getLoadable(state).valueOrThrow()).toBe(undefined);

    await eventCallback({
      type: EventType.TRIGGER_NOTIFICATION_CREATED,
      detail: {notification},
    });

    expect(initialSnapshot.getLoadable(state).valueOrThrow()).toMatchObject(
      notification,
    );
  });

  it('removes notification from state on DELIVERED', async () => {
    const notification = {id: 'some-id-1'};
    mockGetTriggerNotifications.mockResolvedValue([]);

    let eventCallback: EventCallback = () => Promise.resolve();
    mockOnForegroundEvent.mockImplementationOnce(callback => {
      eventCallback = callback;
    });

    const state = notificationAtom(notification.id);
    const initialSnapshot = snapshot_UNSTABLE(({set}) => {
      set(state, notification);
    });

    expect(initialSnapshot.getLoadable(state).valueOrThrow()).toMatchObject(
      notification,
    );

    await eventCallback({
      type: EventType.DELIVERED,
      detail: {notification},
    });

    expect(initialSnapshot.getLoadable(state).valueOrThrow()).toBe(undefined);
  });
});

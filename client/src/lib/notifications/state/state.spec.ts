import notifee, {EventType, Event} from '@notifee/react-native';
import {renderHook} from '@testing-library/react-hooks';

const mockGetTriggerNotifications =
  notifee.getTriggerNotifications as jest.Mock;
const mockOnForegroundEvent = notifee.onForegroundEvent as jest.Mock;

type EventCallback = (event?: Event) => Promise<void>;
let eventCallback: EventCallback = () => Promise.resolve();
mockOnForegroundEvent.mockImplementation(callback => {
  eventCallback = callback;
});

/* This needs to be imported after onForegroundEvent mock implementation as been set
   as the event is subscribed to in the state create function */
const {default: useNotificationsState} = require('./state');

describe('notifications - state', () => {
  it('adds notification to state on TRIGGER_NOTIFICATION_CREATED', async () => {
    const notification = {id: 'some-id-1'};
    mockGetTriggerNotifications.mockResolvedValue([{notification}]);

    const {result} = renderHook(() => useNotificationsState());

    await eventCallback({
      type: EventType.TRIGGER_NOTIFICATION_CREATED,
      detail: {notification},
    });

    expect(result.current.notifications).toEqual({'some-id-1': notification});
  });

  it('removes notification from state on DELIVERED', async () => {
    const notification = {id: 'some-id-1'};
    useNotificationsState.setState({
      notifications: {'some-id-1': notification},
    });
    mockGetTriggerNotifications.mockResolvedValue([]);

    const {result} = renderHook(() => useNotificationsState());

    await eventCallback({
      type: EventType.DELIVERED,
      detail: {notification},
    });

    expect(result.current.notifications).toEqual({});
  });
});

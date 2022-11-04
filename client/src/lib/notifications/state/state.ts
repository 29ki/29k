import notifee, {EventType, Notification} from '@notifee/react-native';
import {atomFamily} from 'recoil';
import {getTriggerNotificationById} from '../utils';
import create from 'zustand';

const NAMESPACE = 'notification';

export const notificationAtom = atomFamily<Notification | undefined, string>({
  key: `${NAMESPACE}/notification`,
  default: async id => await getTriggerNotificationById(id),
  effects: id => [
    ({setSelf}) =>
      notifee.onForegroundEvent(async ({type, detail}) => {
        if (detail.notification?.id === id) {
          switch (type) {
            case EventType.TRIGGER_NOTIFICATION_CREATED:
            case EventType.DELIVERED:
              setSelf(await getTriggerNotificationById(id));
              break;
          }
        }
      }),
  ],
});

type State = {
  notifications: {[key: string]: Notification | undefined};
};

type Actions = {
  setNotification: (
    id: string | undefined,
    notification: Notification | undefined,
  ) => void;
};

const initialState: State = {
  notifications: {},
};

const useNotificationsState = create<State & Actions>()(set => {
  const setNotification: Actions['setNotification'] = (id, notification) =>
    id &&
    set(state => ({
      notifications: {
        ...state.notifications,
        [id]: notification,
      },
    }));

  // Keep state in sync with notification events
  notifee.onForegroundEvent(async ({type, detail}) => {
    if (detail.notification?.id) {
      switch (type) {
        case EventType.TRIGGER_NOTIFICATION_CREATED:
        case EventType.DELIVERED:
          setNotification(
            detail.notification.id,
            await getTriggerNotificationById(detail.notification.id),
          );
          break;
      }
    }
  });

  return {
    ...initialState,
    setNotification,
  };
});

export default useNotificationsState;

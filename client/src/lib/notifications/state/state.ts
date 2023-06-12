import {Notification} from '@notifee/react-native';
import {equals, omit} from 'ramda';
import {create} from 'zustand';

type State = {
  notifications: {[id: string]: Notification};
};

type Actions = {
  setNotification: (id: string | undefined, notification: Notification) => void;
  setNotifications: (notifications: Notification[]) => void;
  removeNotification: (id: string) => void;
  reset: () => void;
};

const initialState: State = {
  notifications: {},
};

const omitData = omit(['android', 'ios']);

/* The only reason to store notifications in a shared state is because notifee.onForegroundEvent
   does not emit anything when a notification is removed
   https://notifee.app/react-native/reference/eventtype */
const useNotificationsState = create<State & Actions>()(set => ({
  ...initialState,
  setNotification: (id, rawNotification) =>
    id &&
    set(state => {
      const notification = omitData(rawNotification);

      if (equals(notification, state.notifications[id])) {
        return state;
      }

      return {
        notifications: {
          ...state.notifications,
          [id]: notification,
        },
      };
    }),
  setNotifications: rawNotifications =>
    set(state => ({
      notifications: rawNotifications.reduce<State['notifications']>(
        (notifications, rawNotification) => {
          const notification = omitData(rawNotification);

          if (!notification.id) {
            return notifications;
          }

          const stateNotification = state.notifications[notification.id];

          return {
            ...notifications,
            [notification.id]: equals(notification, stateNotification)
              ? stateNotification
              : notification,
          };
        },
        {},
      ),
    })),
  removeNotification: id =>
    set(state => ({
      notifications: omit([id], state.notifications),
    })),
  reset: () => set(initialState),
}));

export default useNotificationsState;

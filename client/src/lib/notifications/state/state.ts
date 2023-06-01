import {Notification} from '@notifee/react-native';
import {equals, omit} from 'ramda';
import {create} from 'zustand';

type State = {
  notifications: {[key: string]: Notification | undefined};
};

type Actions = {
  setNotification: (
    id: string | undefined,
    notification: Notification | undefined,
  ) => void;
  removeNotification: (id: string) => void;
  reset: () => void;
};

const initialState: State = {
  notifications: {},
};

/* The only reason to store notifications in a shared state is because notifee.onForegroundEvent
   does not emit anything when a notification is removed
   https://notifee.app/react-native/reference/eventtype */
const useNotificationsState = create<State & Actions>()(set => ({
  ...initialState,
  setNotification: (id, rawNotification) =>
    id &&
    set(state => {
      const notification = rawNotification
        ? omit(['android', 'ios'], rawNotification)
        : undefined;

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
  removeNotification: id =>
    set(state => ({
      notifications: omit([id], state.notifications),
    })),
  reset: () => set(initialState),
}));

export default useNotificationsState;

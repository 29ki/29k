import {Notification} from '@notifee/react-native';
import {omit, startsWith} from 'ramda';
import {create} from 'zustand';

type State = {
  notifications: {[key: string]: Notification | undefined};
};

type Actions = {
  setNotification: (
    id: string | undefined,
    notification: Notification | undefined,
  ) => void;
  reset: () => void;
  resetSessionNotifications: () => void;
  resetPracticeNotifications: () => void;
};

const initialState: State = {
  notifications: {},
};

/* The only reason to store notifications in a shared state is because notifee.onForegroundEvent
   does not emit anything when a notification is removed
   https://notifee.app/react-native/reference/eventtype */
const useNotificationsState = create<State & Actions>()((set, get) => ({
  ...initialState,
  setNotification: (id, notification) =>
    id &&
    set(state => ({
      notifications: {
        ...state.notifications,
        [id]: notification,
      },
    })),
  reset: () => set(initialState),
  resetSessionNotifications: () => {
    const notifications = get().notifications;
    const ids = Object.keys(notifications).filter(startsWith('session/'));
    set({notifications: omit(ids, notifications)});
  },
  resetPracticeNotifications: () => {
    const notifications = get().notifications;
    const ids = Object.keys(notifications).filter(startsWith('practice/'));
    set({notifications: omit(ids, notifications)});
  },
}));

export default useNotificationsState;

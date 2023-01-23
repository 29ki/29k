import {Notification} from '@notifee/react-native';
import {create} from 'zustand';

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

/* The only reason to store notifications in a shared state is because notifee.onForegroundEvent
   does not emit anything when a notification is removed
   https://notifee.app/react-native/reference/eventtype */
const useNotificationsState = create<State & Actions>()(set => ({
  ...initialState,
  setNotification: (id, notification) =>
    id &&
    set(state => ({
      notifications: {
        ...state.notifications,
        [id]: notification,
      },
    })),
}));

export default useNotificationsState;

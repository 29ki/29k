import create from 'zustand';
import {NotificationProps} from '../components/Notifications/Notification';

type State = {
  notifications: NotificationProps[];
};

type Actions = {
  addNotification: (notification: NotificationProps) => void;
  reset: () => void;
};

const initialState: State = {
  notifications: [],
};

const useSessionNotificationsState = create<State & Actions>()(set => ({
  ...initialState,
  addNotification: notification =>
    set(state => ({notifications: [...state.notifications, notification]})),
  reset: () => set(initialState),
}));

export default useSessionNotificationsState;

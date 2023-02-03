import {create} from 'zustand';
import {IconType} from '../../components/Icons';

export type Notification = {
  text: string;
  letter?: string;
  Icon?: IconType;
  image?: string;
  timeVisible?: number;
  visible?: boolean;
};

type State = {
  notifications: Notification[];
};

type Actions = {
  addNotification: (notification: Notification) => void;
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

import notifee, {EventType, Notification} from '@notifee/react-native';
import {find} from 'ramda';
import {atomFamily} from 'recoil';

const NAMESPACE = 'notification';

const getTriggerNotificationById = async (id: string) => {
  const notifications = await notifee.getTriggerNotifications();
  return find(({notification}) => notification.id === id, notifications)
    ?.notification;
};

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

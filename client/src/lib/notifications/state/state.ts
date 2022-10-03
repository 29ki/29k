import notifee, {EventType, Notification} from '@notifee/react-native';
import {atomFamily} from 'recoil';
import {getTriggerNotificationById} from '../utils';

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

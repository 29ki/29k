import notifee from '@notifee/react-native';
import {find} from 'ramda';

export const getTriggerNotificationById = async (id: string) => {
  const notifications = await notifee.getTriggerNotifications();
  return find(({notification}) => notification.id === id, notifications)
    ?.notification;
};

import {useCallback} from 'react';
import useNotificationsState from '../state/state';
import notifee, {Notification, TimestampTrigger} from '@notifee/react-native';

const useNotifications = () => {
  const notificationsState = useNotificationsState(
    state => state.notifications,
  );
  const setNotificationState = useNotificationsState(
    state => state.setNotification,
  );

  const setTriggerNotification = useCallback(
    async (
      id: string,
      channel: string,
      trigger: TimestampTrigger,
      notification: Notification,
    ) => {
      const data = {
        ...notification?.data,
        channel,
      };

      // Optimistic add, will be updated when created by notifee
      setNotificationState(id, {
        ...notification,
        data,
      });

      await notifee.createTriggerNotification(
        {
          ...notification,
          data,
        },
        trigger,
      );
    },
    [setNotificationState],
  );

  const removeTriggerNotification = useCallback(
    async (id: string) => {
      await notifee.cancelTriggerNotification(id);
      setNotificationState(id, undefined);
    },
    [setNotificationState],
  );

  const removeTriggerNotifications = useCallback(
    async (channel: id) => {
      const ids = Object.values(notificationsState.notifications)
        .filter(({data}) => data.channel === channel)
        .map(({id}) => id);

      for (const id of ids) {
        await removeTriggerNotification(id);
      }
    },
    [notificationsState],
  );

  return {
    setTriggerNotification,
    removeTriggerNotification,
    removeTriggerNotifications,
  };
};

export const useNotifications;

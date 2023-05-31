import {useCallback} from 'react';
import useNotificationsState from '../state/state';
import notifee, {TimestampTrigger, TriggerType} from '@notifee/react-native';
import {NotificationChannels} from '../constants';
import useNotificationPermissions from './useNotificationPermissions';

const useTriggerNotifications = () => {
  const {requestPermission} = useNotificationPermissions();

  const setNotificationState = useNotificationsState(
    state => state.setNotification,
  );

  const setTriggerNotification = useCallback(
    async (
      id: string,
      channelId: NotificationChannels,
      title: string,
      body: string,
      url: string | undefined = '',
      timestamp: number,
    ) => {
      console.log('SET');
      if (timestamp > new Date().getTime()) {
        await requestPermission();

        const trigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp,
        };

        // Create a trigger notification
        const notification = {
          id,
          title,
          body,
          android: {
            channelId,
          },
          data: {
            url,
            channelId,
          },
        };

        // Optimistic add, will be updated when created by notifee
        setNotificationState(id, notification);

        await notifee.createTriggerNotification(notification, trigger);
      }
    },
    [requestPermission, setNotificationState],
  );

  const removeTriggerNotification = useCallback(
    async (id: string) => {
      await notifee.cancelTriggerNotification(id);
      setNotificationState(id, undefined);
    },
    [setNotificationState],
  );

  const removeTriggerNotifications = useCallback(
    async (channelId?: NotificationChannels) => {
      const ids = (await notifee.getTriggerNotifications())
        .filter(
          ({notification}) =>
            notification.id &&
            (!channelId || notification.data?.channelId === channelId),
        )
        .map(({notification}) => notification.id);

      for (const id of ids) {
        if (id) {
          await removeTriggerNotification(id);
        }
      }
    },
    [removeTriggerNotification],
  );

  return {
    setTriggerNotification,
    removeTriggerNotification,
    removeTriggerNotifications,
  };
};

export default useTriggerNotifications;

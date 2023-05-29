import {useCallback} from 'react';
import useNotificationsState from '../state/state';
import notifee, {TimestampTrigger, TriggerType} from '@notifee/react-native';
import {NotificationChannels} from '../constants';
import useNotificationPermissions from './useNotificationPermissions';

const useTriggerNotifications = () => {
  const {requestPermission} = useNotificationPermissions();

  const notificationsState = useNotificationsState(
    state => state.notifications,
  );
  const setNotificationState = useNotificationsState(
    state => state.setNotification,
  );

  const getTriggerNotification = useCallback(
    async (id: string) => notificationsState[id],
    [notificationsState],
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
      const ids = Object.values(notificationsState.notifications ?? {})
        .filter(({data}) => (channelId ? data.channelId === channelId : true))
        .map(({id}) => id);

      for (const id of ids) {
        await removeTriggerNotification(id);
      }
    },
    [notificationsState, removeTriggerNotification],
  );

  return {
    getTriggerNotification,
    setTriggerNotification,
    removeTriggerNotification,
    removeTriggerNotifications,
  };
};

export default useTriggerNotifications;

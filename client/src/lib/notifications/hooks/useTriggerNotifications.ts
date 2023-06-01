import {useCallback} from 'react';
import useNotificationsState from '../state/state';
import notifee, {TimestampTrigger, TriggerType} from '@notifee/react-native';
import {NOTIFICATION_CHANNELS, NOTIFICATION_CHANNEL_CONFIG} from '../constants';
import useNotificationPermissions from './useNotificationPermissions';

const useTriggerNotifications = () => {
  const {requestPermission} = useNotificationPermissions();

  const setNotificationState = useNotificationsState(
    state => state.setNotification,
  );

  const setTriggerNotification = useCallback(
    async (
      id: string,
      channelId: NOTIFICATION_CHANNELS,
      title: string,
      body: string,
      url: string | undefined = '',
      image: string | undefined,
      timestamp: number,
    ) => {
      if (timestamp > new Date().getTime()) {
        await requestPermission();

        const channelConfig = NOTIFICATION_CHANNEL_CONFIG[channelId];

        const trigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp,
        };

        // Create a trigger notification
        const notification = {
          id,
          title,
          body,
          data: {
            url,
            channelId,
            date: new Date(timestamp).toISOString(),
          },
          android: {
            ...channelConfig.android,
            channelId,
            largeIcon: image,
          },
          ios: {
            ...channelConfig.ios,
            attachments: image
              ? [
                  {
                    url: image,
                  },
                ]
              : [],
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
    async (channelId?: NOTIFICATION_CHANNELS) => {
      const ids = (await notifee.getTriggerNotifications())
        .filter(
          ({notification}) =>
            !channelId || notification.data?.channelId === channelId,
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

import {useCallback} from 'react';
import notifee, {TimestampTrigger, TriggerType} from '@notifee/react-native';

import useNotificationsState from '../state/state';
import useNotificationPermissions from './useNotificationPermissions';
import useTriggerNotifications from './useTriggerNotifications';

const useTriggerNotification = (id: string) => {
  const requestPermission = useNotificationPermissions();
  const {createTriggerNotification, removeTriggerNotification} =
    useTriggerNotifications();
  const triggerNotification = useNotificationsState(
    state => state.notifications[id],
  );

  const create = useCallback(
    async (
      title: string,
      body: string,
      url: string | undefined = '',
      timestamp: number,
      channel: string,
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
            channelId: 'reminders',
          },
          data: {
            url,
          },
        };

        createTriggerNotification(id, channel, trigger, notification);
      }
    },
    [id, requestPermission, createTriggerNotification],
  );

  const remove = useCallback(
    () => removeTriggerNotification(id),
    [removeTriggerNotification, id],
  );

  return {
    triggerNotification,
    setTriggerNotification: create,
    removeTriggerNotification: remove,
  };
};

export default useTriggerNotification;

import {useCallback, useEffect} from 'react';
import notifee, {TimestampTrigger, TriggerType} from '@notifee/react-native';
import useNotificationsState from '../state/state';
import useResumeFromBackgrounded from '../../appState/hooks/useResumeFromBackgrounded';
import {getTriggerNotificationById} from '../utils';

const useTriggerNotification = (id: string) => {
  const triggerNotification = useNotificationsState(
    state => state.notifications[id],
  );
  const setNotification = useNotificationsState(state => state.setNotification);

  const updateNotification = useCallback(async () => {
    setNotification(id, await getTriggerNotificationById(id));
  }, [id, setNotification]);

  useEffect(() => {
    updateNotification();
  }, [updateNotification]);

  useResumeFromBackgrounded(async () => {
    updateNotification();
  });

  const setTriggerNotification = useCallback(
    async (title: string, body: string, timestamp: number) => {
      // TODO: handle declined permissions better
      await notifee.requestPermission();

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
      };

      setNotification(id, notification);

      await notifee.createTriggerNotification(notification, trigger);
    },
    [id, setNotification],
  );

  const removeTriggerNotification = async () => {
    await notifee.cancelTriggerNotification(id);
    setNotification(id, undefined);
  };

  return {
    triggerNotification,
    setTriggerNotification,
    removeTriggerNotification,
  };
};

export default useTriggerNotification;

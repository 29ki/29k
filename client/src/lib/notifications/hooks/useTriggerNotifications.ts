import {useEffect, useRef, useState} from 'react';
import notifee, {
  EventType,
  Notification,
  TimestampTrigger,
  TriggerNotification,
  TriggerType,
} from '@notifee/react-native';

const getTriggerNotificationById = async (
  notificationId: string,
): Promise<TriggerNotification | undefined> =>
  (await notifee.getTriggerNotifications()).find(
    ({notification}) => notification.id === notificationId,
  );

const useTriggerNotification = (
  id: string | undefined,
): [
  Notification | undefined,
  (title: string, body: string, timestamp: number) => Promise<string>,
  () => Promise<void>,
] => {
  const notificationId = useRef<string | undefined>(id);
  const [notification, setNotification] = useState<Notification>();

  const getExisitingNotification = async () => {
    if (notificationId.current) {
      const triggerNotification = await getTriggerNotificationById(
        notificationId.current,
      );
      setNotification(triggerNotification?.notification);
    }
  };

  const subscribeToNotifications = () =>
    notifee.onForegroundEvent(({type, detail}) => {
      if (detail.notification?.id === notificationId.current) {
        switch (type) {
          case EventType.TRIGGER_NOTIFICATION_CREATED:
            setNotification(detail.notification);
            break;

          case EventType.DELIVERED:
            setNotification(undefined);
            break;
        }
      }
    });

  useEffect(() => {
    getExisitingNotification();
    return subscribeToNotifications();
  }, []);

  const setTrigger = async (title: string, body: string, timestamp: number) => {
    await notifee.requestPermission();

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp,
    };

    // Create a trigger notification
    notificationId.current = await notifee.createTriggerNotification(
      {
        id: notificationId.current,
        title,
        body,
        android: {
          channelId: 'reminders',
        },
      },
      trigger,
    );

    return notificationId.current;
  };

  const removeTrigger = async () => {
    if (notificationId.current) {
      await notifee.cancelTriggerNotification(notificationId.current);
      setNotification(undefined);
      notificationId.current = id;
    }
  };

  return [notification, setTrigger, removeTrigger];
};

export default useTriggerNotification;

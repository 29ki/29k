import {useEffect, useRef, useState} from 'react';
import notifee, {
  EventType,
  Notification,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

const getTriggerNotificationById = async (notificationId: string) =>
  (await notifee.getTriggerNotifications()).find(
    ({notification}) => notification.id === notificationId,
  );

const useTriggerNotification = (id?: string) => {
  const notificationId = useRef<string | undefined>(id);
  const [triggerNotification, setNotification] = useState<Notification>();

  const getExisitingNotification = async () => {
    if (notificationId.current) {
      setNotification(
        (await getTriggerNotificationById(notificationId.current))
          ?.notification,
      );
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

  const setTriggerNotification = async (
    title: string,
    body: string,
    timestamp: number,
  ) => {
    // TODO: handle declined permissions better
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

  const removeTriggerNotification = async () => {
    if (notificationId.current) {
      await notifee.cancelTriggerNotification(notificationId.current);
      setNotification(undefined);
      notificationId.current = id;
    }
  };

  return {
    triggerNotification,
    setTriggerNotification,
    removeTriggerNotification,
  };
};

export default useTriggerNotification;

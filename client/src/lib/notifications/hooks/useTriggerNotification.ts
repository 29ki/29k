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

type SetTriggerNotification = (
  title: string,
  body: string,
  timestamp: number,
) => Promise<string>;

type RemoveTriggerNotification = () => Promise<void>;

const useTriggerNotification = (
  id?: string,
): {
  triggerNotification: Notification | undefined;
  setTriggerNotification: SetTriggerNotification;
  removeTriggerNotification: RemoveTriggerNotification;
} => {
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

  const setTriggerNotification: SetTriggerNotification = async (
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

  const removeTriggerNotification: RemoveTriggerNotification = async () => {
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

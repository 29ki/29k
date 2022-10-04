import {useCallback} from 'react';
import notifee, {TimestampTrigger, TriggerType} from '@notifee/react-native';
import {useRecoilState} from 'recoil';
import {notificationAtom} from '../state/state';
import useResumeFromBackgrounded from '../../appState/hooks/useResumeFromBackgrounded';
import {getTriggerNotificationById} from '../utils';

const useTriggerNotification = (id: string) => {
  const [triggerNotification, setNotification] = useRecoilState(
    notificationAtom(id),
  );
  useResumeFromBackgrounded(async () => {
    setNotification(await getTriggerNotificationById(id));
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

      setNotification(notification);

      await notifee.createTriggerNotification(notification, trigger);
    },
    [setNotification, id],
  );

  const removeTriggerNotification = async () => {
    await notifee.cancelTriggerNotification(id);
    setNotification(undefined);
  };

  return {
    triggerNotification,
    setTriggerNotification,
    removeTriggerNotification,
  };
};

export default useTriggerNotification;

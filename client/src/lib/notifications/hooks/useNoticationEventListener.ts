import notifee, {Event} from '@notifee/react-native';
import {useCallback, useEffect} from 'react';
import useNotificationsState from '../state/state';
import useResumeFromBackgrounded from '../../appState/hooks/useResumeFromBackgrounded';

const useNotificationEventListener = () => {
  const setNotificationState = useNotificationsState(
    state => state.setNotification,
  );

  const updateNotication = useCallback(
    async ({detail}: Event) => {
      // Allways get notifications data from source (notifee) and not event
      const triggerNotifications = await notifee.getTriggerNotifications();
      const triggerNotification = triggerNotifications.find(
        ({notification}) => notification.id === detail.notification?.id,
      );

      if (triggerNotification) {
        setNotificationState(
          triggerNotification.notification.id,
          triggerNotification.notification,
        );
      }
    },
    [setNotificationState],
  );

  const updateNotications = useCallback(async () => {
    // Allways get notifications data from source (notifee) and not event
    const triggerNotifications = await notifee.getTriggerNotifications();
    triggerNotifications.forEach(({notification}) => {
      setNotificationState(notification.id, notification);
    });
  }, [setNotificationState]);

  useEffect(() => notifee.onForegroundEvent(updateNotication));

  // Update all notifications when coming back from backgrounded
  useResumeFromBackgrounded(updateNotications);
};

export default useNotificationEventListener;

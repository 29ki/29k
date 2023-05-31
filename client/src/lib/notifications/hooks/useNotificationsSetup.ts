import notifee, {Event} from '@notifee/react-native';
import {useCallback, useEffect} from 'react';
import useNotificationsState from '../state/state';
import useResumeFromBackgrounded from '../../appState/hooks/useResumeFromBackgrounded';
import {useTranslation} from 'react-i18next';
import {NOTIFICATION_CHANNELS, NOTIFICATION_CHANNEL_CONFIG} from '../constants';

const useNotificationsSetup = () => {
  const {t} = useTranslation('Component.NotificationChannels');
  const resetNotificationsState = useNotificationsState(state => state.reset);
  const setNotificationState = useNotificationsState(
    state => state.setNotification,
  );

  useEffect(() => {
    Object.values(NOTIFICATION_CHANNELS).forEach(id => {
      notifee.createChannel({
        id,
        name: t(id),
        ...NOTIFICATION_CHANNEL_CONFIG[id].channel,
      });
    });
  }, [t]);

  useEffect(
    () =>
      notifee.onForegroundEvent(async ({detail}: Event) => {
        // Allways get notifications data from source (notifee)
        const triggerNotifications = await notifee.getTriggerNotifications();
        const triggerNotification = triggerNotifications.find(
          ({notification}) => notification.id === detail.notification?.id,
        );

        setNotificationState(
          detail.notification?.id,
          triggerNotification?.notification,
        );
      }),
    [setNotificationState],
  );

  // Update all notifications when coming back from backgrounded
  useResumeFromBackgrounded(
    useCallback(async () => {
      resetNotificationsState();
      // Allways get notifications data from source (notifee)
      const triggerNotifications = await notifee.getTriggerNotifications();
      triggerNotifications.forEach(({notification}) => {
        setNotificationState(notification.id, notification);
      });
    }, [setNotificationState, resetNotificationsState]),
  );
};

export default useNotificationsSetup;

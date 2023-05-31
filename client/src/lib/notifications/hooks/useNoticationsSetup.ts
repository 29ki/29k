import notifee, {AndroidImportance, Event} from '@notifee/react-native';
import {useCallback, useEffect} from 'react';
import useNotificationsState from '../state/state';
import useResumeFromBackgrounded from '../../appState/hooks/useResumeFromBackgrounded';
import {useTranslation} from 'react-i18next';
import {NOTIFICATION_CHANNELS, NOTIFICATION_CHANNEL_CONFIG} from '../constants';
import {A} from 'ts-toolbelt';

const useNoticationsSetup = () => {
  const {t} = useTranslation('Component.NotificationChannels');
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

  useEffect(() => {
    Object.values(NOTIFICATION_CHANNELS).forEach(id => {
      notifee.createChannel({
        id,
        name: t(id),
        ...NOTIFICATION_CHANNEL_CONFIG[id].channel,
      });
    });
  }, [t]);

  useEffect(() => notifee.onForegroundEvent(updateNotication));

  // Update all notifications when coming back from backgrounded
  useResumeFromBackgrounded(updateNotications);
};

export default useNoticationsSetup;

import debug from 'debug';
import {useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import notifee, {Event} from '@notifee/react-native';

import useNotificationsState from '../state/state';
import useResumeFromBackgrounded from '../../appState/hooks/useResumeFromBackgrounded';
import {NOTIFICATION_CHANNELS, NOTIFICATION_CHANNEL_CONFIG} from '../constants';

const logDebug = debug('client:notifications');

const useNotificationsSetup = () => {
  const {t} = useTranslation('Component.NotificationChannels');
  const notifications = useNotificationsState(state => state.notifications);
  const resetNotificationsState = useNotificationsState(state => state.reset);
  const setNotificationState = useNotificationsState(
    state => state.setNotification,
  );

  useEffect(() => {
    logDebug('-----------------------');
    logDebug('|PLANNED NOTIFICATIONS|');
    logDebug('-----------------------');
    Object.values(notifications).forEach(({id, title, body, data} = {}) => {
      console.log(`${data?.date} ${title} - ${body} (${id})`);
    });
  }, [notifications]);

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

  const updateNotifications = useCallback(async () => {
    resetNotificationsState();
    // Allways get notifications data from source (notifee)
    const triggerNotifications = await notifee.getTriggerNotifications();
    triggerNotifications.forEach(({notification}) => {
      setNotificationState(notification.id, notification);
    });
  }, [setNotificationState, resetNotificationsState]);

  useEffect(() => {
    updateNotifications();
  }, [updateNotifications]);

  // Update all notifications when coming back from backgrounded
  useResumeFromBackgrounded(updateNotifications);
};

export default useNotificationsSetup;

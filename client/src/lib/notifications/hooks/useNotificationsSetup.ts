import {useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import notifee, {Event} from '@notifee/react-native';

import useNotificationsState from '../state/state';
import useResumeFromBackgrounded from '../../appState/hooks/useResumeFromBackgrounded';
import {NOTIFICATION_CHANNELS, NOTIFICATION_CHANNEL_CONFIG} from '../constants';
import useLogReminderEvents from '../../reminders/hooks/useLogReminderEvents';

const useNotificationsSetup = () => {
  const {t} = useTranslation('Component.NotificationChannels');
  const setNotificationsState = useNotificationsState(
    state => state.setNotifications,
  );
  const logReminderEvent = useLogReminderEvents();

  useEffect(() => {
    Object.values(NOTIFICATION_CHANNELS).forEach(id => {
      notifee.createChannel({
        id,
        name: t(id),
        ...NOTIFICATION_CHANNEL_CONFIG[id].channel,
      });
    });
  }, [t]);

  const updateNotifications = useCallback(async () => {
    // Allways get all notifications from source
    const triggerNotifications = await notifee.getTriggerNotifications();
    setNotificationsState(
      triggerNotifications.map(({notification}) => notification),
    );
  }, [setNotificationsState]);

  const logMetrics = useCallback(
    async (event: Event) => {
      if (event.detail.pressAction) {
        const id = event.detail.notification?.id as string | undefined;
        const channelId = event.detail.notification?.data?.channelId as
          | string
          | undefined;
        const contentId = event.detail.notification?.data?.contentId as
          | string
          | undefined;

        if (id && channelId && contentId) {
          logReminderEvent('Reminder pressed', id, channelId, contentId);
        }
      }
    },
    [logReminderEvent],
  );

  // Update notiiications on mount
  useEffect(() => {
    updateNotifications();
  }, [updateNotifications]);

  // Update notifications when coming back from backgrounded
  useResumeFromBackgrounded(updateNotifications);

  // Update notifications when a notification event is received
  useEffect(() => notifee.onForegroundEvent(updateNotifications));

  // Log metrics when reminders is clicked
  useEffect(() => notifee.onForegroundEvent(logMetrics));
  useEffect(() => notifee.onBackgroundEvent(logMetrics));
};

export default useNotificationsSetup;

import debug from 'debug';
import {useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import notifee from '@notifee/react-native';

import useNotificationsState from '../state/state';
import useResumeFromBackgrounded from '../../appState/hooks/useResumeFromBackgrounded';
import {NOTIFICATION_CHANNELS, NOTIFICATION_CHANNEL_CONFIG} from '../constants';

const logDebug = debug('client:notifications');

const useNotificationsSetup = () => {
  const {t} = useTranslation('Component.NotificationChannels');
  const notifications = useNotificationsState(state => state.notifications);
  const setNotificationsState = useNotificationsState(
    state => state.setNotifications,
  );

  useEffect(() => {
    logDebug('-----------------------');
    logDebug('|PLANNED NOTIFICATIONS|');
    logDebug('-----------------------');
    Object.values(notifications).forEach(({id, title, body, data} = {}) => {
      logDebug(`${data?.date} ${title} - ${body} (${id})`);
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

  const updateNotifications = useCallback(async () => {
    // Allways get all notifications from source
    const triggerNotifications = await notifee.getTriggerNotifications();
    setNotificationsState(
      triggerNotifications.map(({notification}) => notification),
    );
  }, [setNotificationsState]);

  // Update notiiications on mount
  useEffect(() => {
    updateNotifications();
  }, [updateNotifications]);

  // Update notifications when coming back from backgrounded
  useResumeFromBackgrounded(updateNotifications);

  // Update notifications when a notification event is received
  useEffect(() => notifee.onForegroundEvent(updateNotifications));
};

export default useNotificationsSetup;

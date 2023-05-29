import notifee from '@notifee/react-native';
import {useCallback, useEffect} from 'react';
import useNotificationsState from '../state/state';
import useResumeFromBackgrounded from '../../appState/hooks/useResumeFromBackgrounded';

const useNotificationEventListener = () => {
  const setNotification = useNotificationsState(state => state.setNotification);

  const updateNotications = useCallback(async () => {
    const triggerNotifications = await notifee.getTriggerNotifications();
    triggerNotifications.forEach(({notification}) => {
      setNotification(notification.id, notification);
    });
  }, [setNotification]);

  useEffect(() => notifee.onForegroundEvent(updateNotications));

  // Update notification when coming back from backgrounded
  useResumeFromBackgrounded(updateNotications);
};

export default useNotificationEventListener;

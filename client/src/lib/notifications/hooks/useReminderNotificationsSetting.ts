import {useCallback, useEffect, useState} from 'react';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import useCurrentUserState from '../../user/hooks/useCurrentUserState';
import useUserState from '../../user/state/state';
import useRequestNotificationPermission from './useRequestNotificationPermission';
import useNotificationsState from '../state/state';

const useReminderNotificationsSetting = () => {
  const userState = useCurrentUserState();
  const setUserState = useUserState(state => state.setCurrentUserState);
  const [remindersEnabled, setEnabled] = useState<boolean | undefined>();
  const resetNotificationState = useNotificationsState(state => state.reset);
  const requestPermission = useRequestNotificationPermission();

  const checkPermission = useCallback(async () => {
    const permission = await notifee.getNotificationSettings();

    if (userState?.reminderNotifications !== undefined) {
      setEnabled(
        permission.authorizationStatus >= AuthorizationStatus.AUTHORIZED &&
          Boolean(userState?.reminderNotifications),
      );
    } else {
      setEnabled(undefined);
    }
  }, [setEnabled, userState?.reminderNotifications]);

  const setRemindersEnabled = useCallback(
    async (enabled: boolean) => {
      if (enabled) {
        await requestPermission();
      } else {
        await notifee.cancelAllNotifications();
        resetNotificationState();
      }

      setUserState({reminderNotifications: enabled});
    },
    [requestPermission, resetNotificationState, setUserState],
  );

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {remindersEnabled, setRemindersEnabled};
};

export default useReminderNotificationsSetting;

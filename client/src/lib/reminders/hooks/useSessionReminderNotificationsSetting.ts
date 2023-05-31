import {useCallback, useEffect, useState} from 'react';
import useCurrentUserState from '../../user/hooks/useCurrentUserState';
import useUserState from '../../user/state/state';
import useNotificationPermissions from '../../notifications/hooks/useNotificationPermissions';
import useTriggerNotifications from '../../notifications/hooks/useTriggerNotifications';
import {NOTIFICATION_CHANNELS} from '../../notifications/constants';

const useSessionReminderNotificationsSetting = () => {
  const userState = useCurrentUserState();
  const setUserState = useUserState(state => state.setCurrentUserState);
  const [sessionRemindersEnabled, setEnabled] = useState<boolean | undefined>(
    userState?.sessionReminderNotifications,
  );
  const {removeTriggerNotifications} = useTriggerNotifications();
  const {requestPermission, checkPermission} = useNotificationPermissions();

  const updateEnabled = useCallback(async () => {
    const permission = await checkPermission();
    if (userState?.sessionReminderNotifications !== undefined) {
      setEnabled(
        permission && Boolean(userState?.sessionReminderNotifications),
      );
    } else {
      setEnabled(undefined);
    }
  }, [setEnabled, checkPermission, userState?.sessionReminderNotifications]);

  const setSessionRemindersEnabled = useCallback(
    async (enabled: boolean) => {
      if (enabled) {
        await requestPermission();
      } else {
        removeTriggerNotifications(NOTIFICATION_CHANNELS.SESSION_REMINDERS);
      }

      setUserState({sessionReminderNotifications: enabled});
    },
    [requestPermission, removeTriggerNotifications, setUserState],
  );

  useEffect(() => {
    updateEnabled();
  }, [updateEnabled]);

  return {sessionRemindersEnabled, setSessionRemindersEnabled};
};

export default useSessionReminderNotificationsSetting;

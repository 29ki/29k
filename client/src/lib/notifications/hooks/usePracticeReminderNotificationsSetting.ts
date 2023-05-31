import {useCallback, useEffect, useMemo, useState} from 'react';
import useCurrentUserState from '../../user/hooks/useCurrentUserState';
import useUserState, {PracticeReminderConfig} from '../../user/state/state';
import useNotificationPermissions from './useNotificationPermissions';
import useTriggerNotifications from './useTriggerNotifications';
import {NOTIFICATION_CHANNELS} from '../constants';

const usePracticeReminderNotificationsSetting = () => {
  const userState = useCurrentUserState();
  const setUserState = useUserState(state => state.setCurrentUserState);
  const [practiceRemindersEnabled, setEnabled] = useState<boolean | undefined>(
    userState?.practiceReminderConfig
      ? true
      : userState?.practiceReminderConfig === null
      ? false
      : undefined,
  );

  const {removeTriggerNotifications} = useTriggerNotifications();
  const {requestPermission, checkPermission} = useNotificationPermissions();

  const updateEnabled = useCallback(async () => {
    const permission = await checkPermission();

    if (userState?.practiceReminderConfig !== undefined) {
      setEnabled(permission && Boolean(userState?.practiceReminderConfig));
    } else {
      setEnabled(undefined);
    }
  }, [setEnabled, checkPermission, userState?.practiceReminderConfig]);

  const setPracticeRemindersConfig = useCallback(
    async (config: PracticeReminderConfig | null) => {
      if (config) {
        await requestPermission();
      } else {
        removeTriggerNotifications(NOTIFICATION_CHANNELS.PRACTICE_REMINDERS);
      }

      setUserState({practiceReminderConfig: config});
    },
    [requestPermission, removeTriggerNotifications, setUserState],
  );

  useEffect(() => {
    updateEnabled();
  }, [updateEnabled]);

  const practiceReminderConfig = useMemo(
    () => userState?.practiceReminderConfig,
    [userState?.practiceReminderConfig],
  );

  return {
    practiceRemindersEnabled,
    practiceReminderConfig,
    setPracticeRemindersConfig,
  };
};

export default usePracticeReminderNotificationsSetting;

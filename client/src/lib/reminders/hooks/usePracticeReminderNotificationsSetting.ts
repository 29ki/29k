import {useCallback, useEffect, useMemo, useState} from 'react';
import useCurrentUserState from '../../user/hooks/useCurrentUserState';
import useUserState, {PracticeReminderConfig} from '../../user/state/state';
import useNotificationPermissions from '../../notifications/hooks/useNotificationPermissions';
import useUpdatePracticeNotifications from './useUpdatePracticeNotifications';

const usePracticeReminderNotificationsSetting = () => {
  const userState = useCurrentUserState();
  const setUserState = useUserState(state => state.setCurrentUserState);
  const {updatePracticeNotifications} = useUpdatePracticeNotifications();
  const [practiceRemindersEnabled, setEnabled] = useState<boolean | undefined>(
    userState?.practiceReminderConfig
      ? true
      : userState?.practiceReminderConfig === null
      ? false
      : undefined,
  );

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
      }

      setUserState({practiceReminderConfig: config});
      await updatePracticeNotifications(config);
    },
    [requestPermission, setUserState, updatePracticeNotifications],
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

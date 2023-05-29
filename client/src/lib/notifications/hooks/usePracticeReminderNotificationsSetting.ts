import {useCallback, useEffect, useMemo, useState} from 'react';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import useCurrentUserState from '../../user/hooks/useCurrentUserState';
import useUserState, {PracticeReminderConfig} from '../../user/state/state';
import useRequestNotificationPermission from './useRequestNotificationPermission';
import useNotificationsState from '../state/state';
import {startsWith} from 'ramda';

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
  const resetPracticeNotificationState = useNotificationsState(
    state => state.resetPracticeNotifications,
  );
  const requestPermission = useRequestNotificationPermission();

  const checkPermission = useCallback(async () => {
    const permission = await notifee.getNotificationSettings();

    if (userState?.practiceReminderConfig !== undefined) {
      setEnabled(
        permission.authorizationStatus >= AuthorizationStatus.AUTHORIZED &&
          Boolean(userState?.practiceReminderConfig),
      );
    } else {
      setEnabled(undefined);
    }
  }, [setEnabled, userState?.practiceReminderConfig]);

  const setPracticeRemindersEnabled = useCallback(
    async (config: PracticeReminderConfig | null) => {
      if (config) {
        await requestPermission();
      } else {
        const notificationIds = (
          await notifee.getTriggerNotificationIds()
        ).filter(startsWith('practice/'));

        for (const id of notificationIds) {
          await notifee.cancelNotification(id);
        }

        resetPracticeNotificationState();
      }

      setUserState({practiceReminderConfig: config});
    },
    [requestPermission, resetPracticeNotificationState, setUserState],
  );

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const practiceReminderConfig = useMemo(
    () => userState?.practiceReminderConfig,
    [userState?.practiceReminderConfig],
  );

  return {
    practiceRemindersEnabled,
    practiceReminderConfig,
    setPracticeRemindersEnabled,
  };
};

export default usePracticeReminderNotificationsSetting;

import {useCallback, useEffect, useState} from 'react';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import useCurrentUserState from '../../user/hooks/useCurrentUserState';
import useUserState from '../../user/state/state';
import useRequestNotificationPermission from './useRequestNotificationPermission';

const useNotificationSetting = () => {
  const userState = useCurrentUserState();
  const setUserState = useUserState(state => state.setCurrentUserState);
  const [notificationsEnabled, setEnabled] = useState<boolean | undefined>();
  const requestPermission = useRequestNotificationPermission();

  const checkPermission = useCallback(async () => {
    const permission = await notifee.getNotificationSettings();

    if (userState?.notificationsEnabled !== undefined) {
      setEnabled(
        permission.authorizationStatus >= AuthorizationStatus.AUTHORIZED &&
          Boolean(userState?.notificationsEnabled),
      );
    }
  }, [setEnabled, userState?.notificationsEnabled]);

  const setNotificationsEnabled = useCallback(
    async (enabled: boolean) => {
      if (enabled) {
        await requestPermission();
      } else {
        await notifee.cancelAllNotifications();
      }

      setUserState({notificationsEnabled: enabled});
    },
    [requestPermission, setUserState],
  );

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {notificationsEnabled, setNotificationsEnabled};
};

export default useNotificationSetting;

import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {LiveSession} from '../../../../../shared/src/types/Session';
import useNotificationSetting from '../../notifications/hooks/useNotificationSetting';
import useSessionNotificationReminder from './useSessionNotificationReminder';

const useConfirmSessionReminder = (session: LiveSession) => {
  const {t} = useTranslation('Component.ConfirmSessionReminder');
  const {toggleReminder} = useSessionNotificationReminder(session);
  const {notificationsEnabled, setNotificationsEnabled} =
    useNotificationSetting();

  const confirmToggleReminder = useCallback(
    async (enable: boolean) => {
      if (enable && notificationsEnabled === undefined) {
        Alert.alert(t('title'), t('message'), [
          {
            text: t('actions.dismiss'),
            style: 'destructive',
            onPress: async () => {
              await setNotificationsEnabled(false);
            },
          },
          {
            text: t('actions.cancel'),
          },
          {
            text: t('actions.confirm'),
            onPress: async () => {
              await toggleReminder(true);
            },
          },
        ]);
      } else if (notificationsEnabled) {
        await toggleReminder(enable);
      }
    },
    [t, notificationsEnabled, setNotificationsEnabled, toggleReminder],
  );

  return confirmToggleReminder;
};

export default useConfirmSessionReminder;

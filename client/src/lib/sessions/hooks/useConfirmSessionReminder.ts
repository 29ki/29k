import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import useSessionReminderNotificationsSetting from '../../reminders/hooks/useSessionReminderNotificationsSetting';
import useSessionReminderNotification from './useSessionReminderNotification';

const useConfirmSessionReminder = (session: LiveSessionType) => {
  const {t} = useTranslation('Component.ConfirmSessionReminder');
  const {toggleReminder} = useSessionReminderNotification(session);
  const {sessionRemindersEnabled, setSessionRemindersEnabled} =
    useSessionReminderNotificationsSetting();

  const confirmToggleReminder = useCallback(
    async (enable: boolean) => {
      if (enable && sessionRemindersEnabled === undefined) {
        Alert.alert(t('title'), t('message'), [
          {
            text: t('actions.dismiss'),
            style: 'destructive',
            onPress: async () => {
              await setSessionRemindersEnabled(false);
            },
          },
          {
            text: t('actions.cancel'),
          },
          {
            text: t('actions.confirm'),
            onPress: async () => {
              await setSessionRemindersEnabled(true);
              await toggleReminder(true);
            },
          },
        ]);
      } else if (sessionRemindersEnabled) {
        await toggleReminder(enable);
      }
    },
    [t, sessionRemindersEnabled, setSessionRemindersEnabled, toggleReminder],
  );

  return confirmToggleReminder;
};

export default useConfirmSessionReminder;

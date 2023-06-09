import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import useSessionRemindersSetting from '../../reminders/hooks/useSessionRemindersSetting';
import useSessionReminder from './useSessionReminder';
import {logEvent} from '../../metrics';

const useConfirmSessionReminder = (session: LiveSessionType) => {
  const {t} = useTranslation('Component.ConfirmSessionReminder');
  const {toggleReminder} = useSessionReminder(session);
  const {sessionRemindersEnabled, setSessionRemindersEnabled} =
    useSessionRemindersSetting();

  const confirmToggleReminder = useCallback(
    async (enable: boolean) => {
      if (enable && sessionRemindersEnabled === undefined) {
        Alert.alert(t('title'), t('message'), [
          {
            text: t('actions.dismiss'),
            style: 'destructive',
            onPress: async () => {
              await setSessionRemindersEnabled(false);
              logEvent('Decline Sharing Session Reminders', undefined);
            },
          },
          {
            text: t('actions.cancel'),
            onPress: () => {
              logEvent('Postpone Sharing Session Reminders', undefined);
            },
          },
          {
            text: t('actions.confirm'),
            onPress: async () => {
              await setSessionRemindersEnabled(true);
              await toggleReminder(true);
              logEvent('Accept Sharing Session Reminders', undefined);
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

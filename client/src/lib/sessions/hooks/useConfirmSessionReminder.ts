import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import useSessionRemindersSetting from '../../reminders/hooks/useSessionRemindersSetting';
import useSessionReminder from './useSessionReminder';
import useLogSessionReminderEvents from '../../reminders/hooks/useLogSessionReminderEvents';

const useConfirmSessionReminder = (session: LiveSessionType) => {
  const {t} = useTranslation('Component.ConfirmSessionReminder');
  const {toggleReminder} = useSessionReminder(session);
  const {sessionRemindersEnabled, setSessionRemindersEnabled} =
    useSessionRemindersSetting();
  const logSessionReminderEvents = useLogSessionReminderEvents();

  const confirmToggleReminder = useCallback(
    async (enable: boolean) => {
      if (enable && sessionRemindersEnabled === undefined) {
        Alert.alert(t('title'), t('message'), [
          {
            text: t('actions.dismiss'),
            style: 'destructive',
            onPress: async () => {
              await setSessionRemindersEnabled(false);
              logSessionReminderEvents('Session reminders decline');
            },
          },
          {
            text: t('actions.cancel'),
            onPress: () => {
              logSessionReminderEvents('Session reminders later');
            },
          },
          {
            text: t('actions.confirm'),
            onPress: async () => {
              await setSessionRemindersEnabled(true);
              await toggleReminder(true);
              logSessionReminderEvents('Session reminders accept');
            },
          },
        ]);
      } else if (sessionRemindersEnabled) {
        await toggleReminder(enable);
      }
    },
    [
      t,
      sessionRemindersEnabled,
      setSessionRemindersEnabled,
      toggleReminder,
      logSessionReminderEvents,
    ],
  );

  return confirmToggleReminder;
};

export default useConfirmSessionReminder;

import {useCallback} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import usePracticeRemindersSetting from './usePracticeRemindersSetting';
import {ModalStackProps} from '../../navigation/constants/routes';
import {calculateNextHalfHour, thisWeekday} from '../utils/timeHelpers';
import {logEvent} from '../../metrics';

const useConfirmPracticeReminders = () => {
  const {t} = useTranslation('Component.ConfirmPracticeReminders');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const {practiceReminderConfig, setPracticeRemindersConfig} =
    usePracticeRemindersSetting();

  const confirmPracticeReminder = useCallback(
    async (enable: boolean) => {
      if (enable && practiceReminderConfig === undefined) {
        Alert.alert(t('title'), t('message'), [
          {
            text: t('actions.dismiss'),
            style: 'destructive',
            onPress: async () => {
              await setPracticeRemindersConfig(null);
              logEvent('Decline Practice Reminders', undefined);
            },
          },
          {
            text: t('actions.cancel'),
            onPress: () => {
              logEvent('Postpone Practice Reminders', undefined);
            },
          },
          {
            text: t('actions.confirm'),
            onPress: async () => {
              const interval = thisWeekday();
              const [hour, minute] = calculateNextHalfHour(dayjs().utc());
              await setPracticeRemindersConfig({interval, hour, minute});
              logEvent('Accept Practice Reminders', undefined);
              navigate('RemindersModal', {hideSessionSetting: true});
            },
          },
        ]);
      } else if (practiceReminderConfig) {
        await setPracticeRemindersConfig(null);
      }
    },
    [t, navigate, setPracticeRemindersConfig, practiceReminderConfig],
  );

  return confirmPracticeReminder;
};

export default useConfirmPracticeReminders;

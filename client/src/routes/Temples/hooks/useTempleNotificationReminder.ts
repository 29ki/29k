import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';
import {Temple} from '../../../../../shared/src/types/Temple';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import NS from '../../../lib/i18n/constants/namespaces';
import useTriggerNotification from '../../../lib/notifications/hooks/useTriggerNotification';

type ToggleFunction = (enable: boolean) => Promise<string | void>;

const useTempleNotificationReminder = (
  temple: Temple,
): {reminderEnabled: boolean; toggleReminder: ToggleFunction} => {
  const {id, name, contentId} = temple;

  const {t} = useTranslation(NS.COMPONENT.SESSION_REMINDER);
  const exercise = useExerciseById(contentId);

  const [notification, setNotification, removeNotification] =
    useTriggerNotification(id);

  const reminderEnabled = Boolean(notification);

  const toggleReminder: ToggleFunction = async (enable = true) =>
    enable
      ? setNotification(
          t('title', {name, exercise: exercise?.name}),
          t('body'),
          dayjs().add(10, 'seconds').valueOf(),
        )
      : removeNotification();

  return {reminderEnabled, toggleReminder};
};

export default useTempleNotificationReminder;

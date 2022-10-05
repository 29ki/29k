import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';
import {Temple} from '../../../../../shared/src/types/Temple';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import NS from '../../../lib/i18n/constants/namespaces';
import useTriggerNotification from '../../../lib/notifications/hooks/useTriggerNotification';

const useTempleNotificationReminder = (temple: Temple) => {
  const {id, contentId, startTime} = temple;

  const {t} = useTranslation(NS.COMPONENT.SESSION_REMINDER);
  const exercise = useExerciseById(contentId);

  const {
    triggerNotification,
    setTriggerNotification,
    removeTriggerNotification,
  } = useTriggerNotification(id);

  const reminderEnabled = Boolean(triggerNotification);

  const toggleReminder = async (enable = true) =>
    enable
      ? setTriggerNotification(
          t('title', {exercise: exercise?.name}),
          t('body'),
          dayjs(startTime).subtract(10, 'minutes').valueOf(),
        )
      : removeTriggerNotification();

  return {reminderEnabled, toggleReminder};
};

export default useTempleNotificationReminder;

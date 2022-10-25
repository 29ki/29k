import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';
import {Session} from '../../../../../shared/src/types/Session';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import * as NS from '../../../../../shared/src/constants/namespaces';
import useTriggerNotification from '../../../lib/notifications/hooks/useTriggerNotification';

const useSessionNotificationReminder = (session: Session) => {
  const {id, contentId, startTime} = session;

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

export default useSessionNotificationReminder;

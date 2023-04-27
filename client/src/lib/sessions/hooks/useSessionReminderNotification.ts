import dayjs from 'dayjs';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import useExerciseById from '../../content/hooks/useExerciseById';
import useTriggerNotification from '../../notifications/hooks/useTriggerNotification';

const useSessionReminderNotification = (session: LiveSessionType) => {
  const {id, exerciseId, startTime, link} = session;

  const {t} = useTranslation('Component.SessionReminder');
  const exercise = useExerciseById(exerciseId);

  const {
    triggerNotification,
    setTriggerNotification,
    removeTriggerNotification,
  } = useTriggerNotification(id);

  const reminderEnabled = Boolean(triggerNotification);

  const toggleReminder = useCallback(
    async (enable = true) =>
      enable
        ? setTriggerNotification(
            t('title', {exercise: exercise?.name}),
            t('body'),
            link,
            dayjs(startTime).subtract(10, 'minutes').valueOf(),
          )
        : removeTriggerNotification(),
    [
      setTriggerNotification,
      removeTriggerNotification,
      exercise?.name,
      link,
      startTime,
      t,
    ],
  );

  return {reminderEnabled, toggleReminder};
};

export default useSessionReminderNotification;

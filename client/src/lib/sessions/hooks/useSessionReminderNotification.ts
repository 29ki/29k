import dayjs from 'dayjs';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import useExerciseById from '../../content/hooks/useExerciseById';
import useTriggerNotifications from '../../notifications/hooks/useTriggerNotifications';
import {NotificationChannels} from '../../notifications/constants';
import useNotificationsState from '../../notifications/state/state';

const useSessionReminderNotification = (session: LiveSessionType) => {
  const {id, exerciseId, startTime, link} = session;

  const {t} = useTranslation('Component.SessionReminder');
  const exercise = useExerciseById(exerciseId);

  const {setTriggerNotification, removeTriggerNotification} =
    useTriggerNotifications();

  const reminderEnabled = Boolean(
    useNotificationsState(state => state.notifications[id]),
  );

  const toggleReminder = useCallback(
    async (enable = true) =>
      enable
        ? setTriggerNotification(
            id,
            NotificationChannels.SESSION_REMINDER,
            t('title', {exercise: exercise?.name}),
            t('body'),
            link,
            dayjs(startTime).subtract(10, 'minutes').valueOf(),
          )
        : removeTriggerNotification(id),
    [
      setTriggerNotification,
      removeTriggerNotification,
      id,
      exercise?.name,
      link,
      startTime,
      t,
    ],
  );

  return {reminderEnabled, toggleReminder};
};

export default useSessionReminderNotification;

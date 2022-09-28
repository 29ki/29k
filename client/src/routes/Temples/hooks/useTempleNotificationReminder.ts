import {Notification} from '@notifee/react-native';
import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';
import {Temple} from '../../../../../shared/src/types/Temple';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import NS from '../../../lib/i18n/constants/namespaces';
import useTriggerNotification from '../../../lib/notifications/hooks/useTriggerNotification';

const useTempleNotificationReminder = (
  temple: Temple,
): [Notification | undefined, (enabled: boolean) => Promise<string | void>] => {
  const {id, name, contentId} = temple;

  const {t} = useTranslation(NS.COMPONENT.SESSION_REMINDER);
  const exercise = useExerciseById(contentId);

  const [notification, setNotification, removeNotification] =
    useTriggerNotification(id);

  const setReminder = async (enabled = true) =>
    enabled
      ? setNotification(
          t('title', {name, exercise: exercise?.name}),
          t('body'),
          dayjs().add(10, 'seconds').valueOf(),
        )
      : removeNotification();

  return [notification, setReminder];
};

export default useTempleNotificationReminder;

import {useCallback} from 'react';
import dayjs from 'dayjs';

import useCurrentUserState from '../user/hooks/useCurrentUserState';
import {
  DEFAULT_NUMBER_OF_PRACTICE_REMINDERS,
  NOTIFICATION_CHANNELS,
} from '../notifications/constants';
import usePinnedCollections from '../user/hooks/usePinnedCollections';
import useGetCollectionById from '../content/hooks/useGetCollectionById';
import useUserEvents from '../user/hooks/useUserEvents';
import useTriggerNotifications from '../notifications/hooks/useTriggerNotifications';
import {calculateNextReminderTime} from './utils';
import {IntervalEnum} from '../user/types/Interval';
import {Collection} from '../../../../shared/src/types/generated/Collection';

const useUpdatePracticeNotifications = () => {
  const userState = useCurrentUserState();
  const {pinnedCollections} = usePinnedCollections();
  const {completedCollectionEvents} = useUserEvents();
  const getCollectionById = useGetCollectionById();
  const {removeTriggerNotifications, setTriggerNotification} =
    useTriggerNotifications();

  const reCreateNotifications = useCallback(
    async (collection?: Collection | null) => {
      await removeTriggerNotifications(NOTIFICATION_CHANNELS.PRACTICE_REMINDER);
      if (userState?.practiceReminderConfig) {
        const nextReminderTime = calculateNextReminderTime(
          dayjs(),
          userState.practiceReminderConfig,
        );
        for (
          let index = 0;
          index < DEFAULT_NUMBER_OF_PRACTICE_REMINDERS;
          index++
        ) {
          await setTriggerNotification(
            index.toString(),
            NOTIFICATION_CHANNELS.PRACTICE_REMINDER,
            'Practice reminder',
            `Time to practice ${
              collection?.name ? collection?.name : ''
            }`.trim(),
            collection?.link,
            collection?.image?.source,
            nextReminderTime
              .add(
                index,
                userState.practiceReminderConfig.interval ===
                  IntervalEnum.everyDay
                  ? 'day'
                  : 'week',
              )
              .valueOf(),
          );
        }
      }
    },
    [
      userState?.practiceReminderConfig,
      removeTriggerNotifications,
      setTriggerNotification,
    ],
  );

  const updatePracticeNotifications = useCallback(async () => {
    const pinnedCollection = pinnedCollections
      .sort(
        (a, b) =>
          new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime(),
      )
      .find(c =>
        completedCollectionEvents.find(
          cc =>
            cc.payload.id === c.id && dayjs(c.startedAt).isAfter(cc.timestamp),
        ),
      );
    const collection = pinnedCollection
      ? getCollectionById(pinnedCollection.id)
      : undefined;

    await reCreateNotifications(collection);
  }, [
    completedCollectionEvents,
    pinnedCollections,
    getCollectionById,
    reCreateNotifications,
  ]);

  return {
    updatePracticeNotifications,
  };
};

export default useUpdatePracticeNotifications;

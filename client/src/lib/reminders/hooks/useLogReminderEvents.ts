import {useCallback} from 'react';
import * as metrics from '../../metrics';
import {NOTIFICATION_CHANNELS} from '../../notifications/constants';

type AllowedReminderEvents = 'Reminder pressed';

const useLogReminderEvents = () => {
  return useCallback(
    (
      event: AllowedReminderEvents,
      id: string,
      channelId: string,
      contentId: string,
    ) => {
      if (channelId === NOTIFICATION_CHANNELS.PRACTICE_REMINDERS) {
        metrics.logEvent(event, {id, channelId, collectionId: contentId});
      } else {
        metrics.logEvent(event, {id, channelId, exerciseId: contentId});
      }
    },
    [],
  );
};

export default useLogReminderEvents;

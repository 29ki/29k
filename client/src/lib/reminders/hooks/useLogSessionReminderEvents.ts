import {useCallback} from 'react';
import * as metrics from '../../metrics';

type AllowedSessionReminderEvents =
  | 'Session reminders accept'
  | 'Session reminders later'
  | 'Session reminders decline'
  | 'Session reminders toggle';

const useLogSessionReminderEvents = () => {
  return useCallback(
    (event: AllowedSessionReminderEvents, enable?: boolean) => {
      if (enable !== undefined && event === 'Session reminders toggle') {
        metrics.logEvent(event, {enable});
      } else {
        metrics.logEvent(event, undefined);
      }
    },
    [],
  );
};

export default useLogSessionReminderEvents;

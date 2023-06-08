import {useCallback} from 'react';
import * as metrics from '../../metrics';
import {PracticeReminderConfig} from '../../user/state/state';

type AllowedPracticeReminderEvents =
  | 'Practice reminders accept'
  | 'Practice reminders later'
  | 'Practice reminders decline'
  | 'Practice reminders change'
  | 'Practice reminders remove';

const useLogPracticeReminderEvents = () => {
  return useCallback(
    (event: AllowedPracticeReminderEvents, config?: PracticeReminderConfig) => {
      if (config && event === 'Practice reminders change') {
        metrics.logEvent(event, config);
      } else {
        metrics.logEvent(event, undefined);
      }
    },
    [],
  );
};

export default useLogPracticeReminderEvents;

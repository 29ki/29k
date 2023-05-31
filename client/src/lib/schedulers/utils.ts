import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import {PracticeReminderConfig} from '../user/state/state';
import {IntervalEnum} from '../user/types/Interval';

dayjs.extend(isoWeek);

export const calculateNextReminderTime = (
  now: dayjs.Dayjs,
  config: PracticeReminderConfig,
): dayjs.Dayjs => {
  const weekdayIndex = Object.values(IntervalEnum).indexOf(config.interval);
  const todaysWeekday = now.isoWeekday();
  if (weekdayIndex > 0) {
    if (todaysWeekday < weekdayIndex) {
      return now
        .isoWeekday(weekdayIndex)
        .set('hour', config.hour)
        .set('minute', config.minute)
        .set('second', 0);
    } else if (todaysWeekday === weekdayIndex) {
      const nextTime = now
        .set('hour', config.hour)
        .set('minute', config.minute)
        .set('second', 0);

      if (nextTime.isAfter(now)) {
        return nextTime;
      }

      return nextTime
        .set('hour', config.hour)
        .set('minute', config.minute)
        .set('second', 0)
        .add(1, 'week');
    } else {
      return now
        .add(1, 'week')
        .isoWeekday(weekdayIndex)
        .set('hour', config.hour)
        .set('minute', config.minute)
        .set('second', 0);
    }
  } else {
    const nextTime = now
      .set('hour', config.hour)
      .set('minute', config.minute)
      .set('second', 0);
    if (nextTime.isAfter(now)) {
      return nextTime;
    }
    return nextTime.add(1, 'day');
  }
};

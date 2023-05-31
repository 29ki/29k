import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import {PracticeReminderConfig} from '../user/state/state';
import {IntervalEnum} from '../user/types/Interval';

dayjs.extend(isoWeek);
dayjs.extend(utc);

export const calculateNextReminderTime = (
  nowLocal: dayjs.Dayjs,
  config: PracticeReminderConfig,
): dayjs.Dayjs => {
  const now = nowLocal.utc();
  const weekdayIndex = Object.values(IntervalEnum).indexOf(config.interval);
  const todaysWeekday = now.isoWeekday();
  if (weekdayIndex > 0) {
    if (todaysWeekday < weekdayIndex) {
      return now
        .isoWeekday(weekdayIndex)
        .set('hour', config.hour)
        .set('minute', config.minute);
    } else if (todaysWeekday === weekdayIndex) {
      const nextTime = now
        .set('hour', config.hour)
        .set('minute', config.minute);

      if (nextTime.isAfter(now)) {
        return nextTime;
      }

      return nextTime
        .set('hour', config.hour)
        .set('minute', config.minute)
        .add(1, 'week');
    } else {
      return now
        .add(1, 'week')
        .isoWeekday(weekdayIndex)
        .set('hour', config.hour)
        .set('minute', config.minute);
    }
  } else {
    const nextTime = now.set('hour', config.hour).set('minute', config.minute);
    if (nextTime.isAfter(now)) {
      return nextTime;
    }
    return nextTime.add(1, 'day');
  }
};

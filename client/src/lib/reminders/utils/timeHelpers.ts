import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import {PracticeReminderConfig} from '../../user/state/state';
import {REMINDER_INTERVALS} from '../constants';

dayjs.extend(isoWeek);

export const calculateNextReminderTime = (
  now: dayjs.Dayjs,
  config: PracticeReminderConfig,
): dayjs.Dayjs => {
  const weekdayIndex = Object.values(REMINDER_INTERVALS).indexOf(
    config.interval,
  );
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

export const calculateNextHalfHour = (now: dayjs.Dayjs): [number, number] => {
  if (now.minute() === 30) {
    return [now.hour(), now.minute()];
  }
  if (now.minute() < 30) {
    return [now.hour(), 30];
  }

  const time = now.add(1, 'hour');
  return [time.hour(), 0];
};

export const thisWeekday = (): REMINDER_INTERVALS => {
  return Object.values(REMINDER_INTERVALS)[
    dayjs().isoWeekday()
  ] as REMINDER_INTERVALS;
};

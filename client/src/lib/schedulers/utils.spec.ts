import dayjs from 'dayjs';
import {calculateNextReminderTime} from './utils';
import {IntervalEnum} from '../user/types/Interval';

describe('calculateNextReminderTime', () => {
  it('should give future weekday in current week', () => {
    expect(
      calculateNextReminderTime(dayjs(new Date('2023-05-30T09:00:00')), {
        interval: IntervalEnum.thursday,
        hour: 10,
        minute: 0,
      }).toDate(),
    ).toEqual(dayjs(new Date('2023-06-01T10:00:00')).toDate());
  });

  it('should give future weekday in next week', () => {
    expect(
      calculateNextReminderTime(dayjs(new Date('2023-05-30T09:00:00')), {
        interval: IntervalEnum.monday,
        hour: 10,
        minute: 0,
      }).toDate(),
    ).toEqual(dayjs(new Date('2023-06-05T10:00:00')).toDate());
  });

  it('should give later today if same weekday as today and time is after now', () => {
    expect(
      calculateNextReminderTime(dayjs(new Date('2023-05-30T09:00:00')), {
        interval: IntervalEnum.tuseday,
        hour: 10,
        minute: 0,
      }).toDate(),
    ).toEqual(dayjs(new Date('2023-05-30T10:00:00')).toDate());
  });

  it('should give next week if same weekday as today and time before now', () => {
    expect(
      calculateNextReminderTime(dayjs(new Date('2023-05-30T11:00:00')), {
        interval: IntervalEnum.tuseday,
        hour: 10,
        minute: 0,
      }).toDate(),
    ).toEqual(dayjs(new Date('2023-06-06T10:00:00')).toDate());
  });

  it('should give tomorrow if every day and time is befor now', () => {
    expect(
      calculateNextReminderTime(dayjs(new Date('2023-05-30T11:00:00')), {
        interval: IntervalEnum.everyDay,
        hour: 10,
        minute: 0,
      }).toDate(),
    ).toEqual(dayjs(new Date('2023-05-31T10:00:00')).toDate());
  });

  it('should give later today if every day and time is after now', () => {
    expect(
      calculateNextReminderTime(dayjs(new Date('2023-05-30T10:00:00')), {
        interval: IntervalEnum.everyDay,
        hour: 11,
        minute: 0,
      }).toDate(),
    ).toEqual(dayjs(new Date('2023-05-30T11:00:00')).toDate());
  });
});

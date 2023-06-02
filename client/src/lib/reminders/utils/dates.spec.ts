import dayjs from 'dayjs';
import {calculateNextReminderTime} from './dates';
import {REMINDER_INTERVALS} from '../constants';

describe('calculateNextReminderTime', () => {
  it('should give future weekday in current week', () => {
    expect(
      calculateNextReminderTime(dayjs('2023-05-30T09:00:00Z'), {
        interval: REMINDER_INTERVALS.THURSDAY,
        hour: 10,
        minute: 0,
      }).toDate(),
    ).toEqual(dayjs('2023-06-01T10:00:00Z').toDate());
  });

  it('should give future weekday in next week', () => {
    expect(
      calculateNextReminderTime(dayjs('2023-05-30T09:00:00Z'), {
        interval: REMINDER_INTERVALS.MONDAY,
        hour: 10,
        minute: 0,
      }).toDate(),
    ).toEqual(dayjs('2023-06-05T10:00:00Z').toDate());
  });

  it('should give later today if same weekday as today and time is after now', () => {
    expect(
      calculateNextReminderTime(dayjs('2023-05-30T09:00:00Z'), {
        interval: REMINDER_INTERVALS.TUESDAY,
        hour: 10,
        minute: 0,
      }).toDate(),
    ).toEqual(dayjs('2023-05-30T10:00:00Z').toDate());
  });

  it('should give next week if same weekday as today and time before now', () => {
    expect(
      calculateNextReminderTime(dayjs('2023-05-30T11:00:00Z'), {
        interval: REMINDER_INTERVALS.TUESDAY,
        hour: 10,
        minute: 0,
      }).toDate(),
    ).toEqual(dayjs('2023-06-06T10:00:00Z').toDate());
  });

  it('should give tomorrow if every day and time is befor now', () => {
    expect(
      calculateNextReminderTime(dayjs('2023-05-30T11:00:00Z'), {
        interval: REMINDER_INTERVALS.DAILY,
        hour: 10,
        minute: 0,
      }).toDate(),
    ).toEqual(dayjs('2023-05-31T10:00:00Z').toDate());
  });

  it('should give later today if every day and time is after now', () => {
    expect(
      calculateNextReminderTime(dayjs('2023-05-30T10:00:00Z'), {
        interval: REMINDER_INTERVALS.DAILY,
        hour: 11,
        minute: 0,
      }).toDate(),
    ).toEqual(dayjs('2023-05-30T11:00:00Z').toDate());
  });
});

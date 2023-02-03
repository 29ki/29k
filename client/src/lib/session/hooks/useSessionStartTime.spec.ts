import {renderHook} from '@testing-library/react-hooks';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import useSessionStartTime from './useSessionStartTime';

dayjs.extend(localizedFormat);

const mockT = jest.fn().mockReturnValue('in-minutes-translation');
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: mockT,
  })),
}));

MockDate.set('2022-11-14T11:47:35'); // NOW

const startTimes = {
  lessThanAnHour: '2022-11-14T12:30:35',
  today: '2022-11-14T15:49:35',
  future: '2022-11-15T15:49:35',
  lessThanAMinute: '2022-11-14T11:47:00',
  lessThanTenMinutes: '2022-11-14T11:52:35',
  hasPassed: '2022-11-14T11:47:34',
};

describe('useSessionStartTime', () => {
  describe('time', () => {
    it('returns translated time when starTime is in less than hour', () => {
      const {result} = renderHook(() =>
        useSessionStartTime(dayjs(startTimes.lessThanAnHour)),
      );
      expect(mockT).toHaveBeenCalledWith('inMinutes', {
        minutes: 43,
        seconds: 0,
      });
      expect(result.current.time).toEqual('in-minutes-translation');
    });

    it('returns time when starTime is today', () => {
      const {result} = renderHook(() =>
        useSessionStartTime(dayjs(startTimes.today)),
      );
      expect(result.current.time).toEqual('3:49 PM');
    });

    it('returns date and time when starTime is future days', () => {
      const {result} = renderHook(() =>
        useSessionStartTime(dayjs(startTimes.future)),
      );
      expect(result.current.time).toEqual('Tue, 15 Nov 3:49 PM');
    });
  });

  describe('isStartingShortly', () => {
    it('should be true', () => {
      const {result} = renderHook(() =>
        useSessionStartTime(dayjs(startTimes.lessThanAMinute)),
      );
      expect(result.current.isStartingShortly).toEqual(true);
    });

    it('should be false', () => {
      const {result} = renderHook(() =>
        useSessionStartTime(dayjs(startTimes.future)),
      );
      expect(result.current.isStartingShortly).toEqual(false);
    });
  });

  describe('isReadyToJoin', () => {
    it('should be true', () => {
      const {result} = renderHook(() =>
        useSessionStartTime(dayjs(startTimes.lessThanTenMinutes)),
      );
      expect(result.current.isReadyToJoin).toEqual(true);
    });

    it('should be false', () => {
      const {result} = renderHook(() =>
        useSessionStartTime(dayjs(startTimes.future)),
      );
      expect(result.current.isReadyToJoin).toEqual(false);
    });
  });

  describe('isStarted', () => {
    it('should be true', () => {
      const {result} = renderHook(() =>
        useSessionStartTime(dayjs(startTimes.hasPassed)),
      );
      expect(result.current.isStarted).toEqual(true);
    });

    it('should be false', () => {
      const {result} = renderHook(() =>
        useSessionStartTime(dayjs(startTimes.future)),
      );
      expect(result.current.isStarted).toEqual(false);
    });
  });
});

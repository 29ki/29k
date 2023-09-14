import * as logMindfulMinutes from './logMindfulMinutes.ios';
import HealthKit from '@kingstinct/react-native-healthkit';

const mockRequestAuthorization = jest.mocked(HealthKit.requestAuthorization);
const mockAuthorizationStatusFor = jest.mocked(
  HealthKit.authorizationStatusFor,
);
const mockSaveCategorySample = jest.mocked(HealthKit.saveCategorySample);
const mockIsHealthDataAvailable = jest.mocked(HealthKit.isHealthDataAvailable);

afterEach(jest.clearAllMocks);

describe('logMindfulMinutes.ios', () => {
  describe('isAvailable', () => {
    it('returns true when HealthKit.isHealthDataAvailable() returns true', async () => {
      mockIsHealthDataAvailable.mockResolvedValueOnce(true);

      const result = await logMindfulMinutes.isAvailable();

      expect(result).toBe(true);
    });

    it('returns false when HealthKit.isHealthDataAvailable() returns false', async () => {
      mockIsHealthDataAvailable.mockResolvedValueOnce(false);

      const result = await logMindfulMinutes.isAvailable();

      expect(result).toBe(false);
    });
  });

  describe('requestAuthorization', () => {
    it('calls HealthKit.requestAuthorization with the correct arguments', async () => {
      await logMindfulMinutes.requestAuthorization();

      expect(mockRequestAuthorization).toHaveBeenCalledTimes(1);
      expect(mockRequestAuthorization).toHaveBeenCalledWith(
        [],
        ['mindfulSession'],
      );
    });

    it('returns the result of HealthKit.requestAuthorization', async () => {
      mockRequestAuthorization.mockResolvedValueOnce(true);

      expect(await logMindfulMinutes.requestAuthorization()).toBe(true);
    });
  });

  describe('getAuthorizationStatus', () => {
    it('calls HealthKit.isHealthDataAvailable', async () => {
      await logMindfulMinutes.getAuthorizationStatus();

      expect(mockIsHealthDataAvailable).toHaveBeenCalledTimes(1);
    });

    it('calls HealthKit.authorizationStatusFor with the correct arguments', async () => {
      mockIsHealthDataAvailable.mockResolvedValueOnce(true);

      await logMindfulMinutes.getAuthorizationStatus();

      expect(mockAuthorizationStatusFor).toHaveBeenCalledTimes(1);
      expect(mockAuthorizationStatusFor).toHaveBeenCalledWith('mindfulSession');
    });

    it('returns the result of HealthKit.authorizationStatusFor', async () => {
      mockIsHealthDataAvailable.mockResolvedValueOnce(true);
      mockAuthorizationStatusFor.mockResolvedValueOnce(2);

      expect(await logMindfulMinutes.getAuthorizationStatus()).toBe(true);
    });

    it('returns false when HealthKit.isHealthDataAvailable returns false', async () => {
      mockIsHealthDataAvailable.mockResolvedValueOnce(false);

      expect(await logMindfulMinutes.getAuthorizationStatus()).toBe(false);
    });

    it('returns false when HealthKit.authorizationStatusFor returns 0', async () => {
      mockIsHealthDataAvailable.mockResolvedValueOnce(true);
      mockAuthorizationStatusFor.mockResolvedValueOnce(0);

      expect(await logMindfulMinutes.getAuthorizationStatus()).toBe(false);
    });
  });

  describe('log', () => {
    it('calls HealthKit.saveCategorySample with the correct arguments', async () => {
      await logMindfulMinutes.log(
        new Date('2001-01-01T01:01:01Z'),
        new Date('2002-02-02T02:02:02Z'),
      );

      expect(mockSaveCategorySample).toHaveBeenCalledTimes(1);
      expect(mockSaveCategorySample).toHaveBeenCalledWith('mindfulSession', 0, {
        start: new Date('2001-01-01T01:01:01Z'),
        end: new Date('2002-02-02T02:02:02Z'),
      });
    });

    it('returns the result of HealthKit.saveCategorySample', async () => {
      mockSaveCategorySample.mockResolvedValueOnce(true);

      expect(
        await logMindfulMinutes.log(
          new Date('2001-01-01T01:01:01Z'),
          new Date('2002-02-02T02:02:02Z'),
        ),
      ).toBe(true);
    });
  });
});

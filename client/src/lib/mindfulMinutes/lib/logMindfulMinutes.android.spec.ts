import * as logMindfulMinutes from './logMindfulMinutes.android';

afterEach(jest.clearAllMocks);

describe('logMindfulMinutes.android', () => {
  describe('isAvailable', () => {
    it('returns false', async () => {
      expect(await logMindfulMinutes.isAvailable()).toBe(false);
    });
  });

  describe('requestAuthorization', () => {
    it('returns false', async () => {
      expect(await logMindfulMinutes.requestAuthorization()).toBe(false);
    });
  });

  describe('getAuthorizationStatus', () => {
    it('returns false', async () => {
      expect(await logMindfulMinutes.getAuthorizationStatus()).toBe(false);
    });
  });

  describe('log', () => {
    it('returns false', async () => {
      expect(
        await logMindfulMinutes.log(
          new Date('2001-01-01T01:01:01Z'),
          new Date('2002-02-02T02:02:02Z'),
        ),
      ).toBe(false);
    });
  });
});

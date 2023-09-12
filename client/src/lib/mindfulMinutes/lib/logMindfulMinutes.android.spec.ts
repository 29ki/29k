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
      expect(await logMindfulMinutes.log()).toBe(false);
    });
  });
});

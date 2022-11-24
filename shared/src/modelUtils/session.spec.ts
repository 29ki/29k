import {Timestamp} from 'firebase-admin/firestore';
import {SessionData} from '../types/Session';
import {getSession} from './session';

describe('session', () => {
  describe('getSession', () => {
    it('should transform session data firestore timestamps into dates', async () => {
      const someDate = new Date('2022-11-16');
      const sessionData = {
        id: 'some-session-id',
        startTime: Timestamp.fromDate(someDate),
        createdAt: Timestamp.fromDate(someDate),
        updatedAt: Timestamp.fromDate(someDate),
        exerciseState: {
          timestamp: Timestamp.fromDate(someDate),
        },
      } as SessionData;

      expect(getSession(sessionData)).toEqual({
        id: 'some-session-id',
        exerciseState: {timestamp: '2022-11-16T00:00:00.000Z'},
        createdAt: '2022-11-16T00:00:00.000Z',
        startTime: '2022-11-16T00:00:00.000Z',
        updatedAt: '2022-11-16T00:00:00.000Z',
      });
    });
  });
});

import {Timestamp} from 'firebase-admin/firestore';
import {LiveSessionData, SessionStateData} from '../types/Session';
import {getSession, getSessionState} from './session';

describe('session', () => {
  describe('getSession', () => {
    it('should transform session data firestore timestamps into dates', async () => {
      const someDate = new Date('2022-11-16');
      const sessionData = {
        id: 'some-session-id',
        startTime: Timestamp.fromDate(someDate),
        createdAt: Timestamp.fromDate(someDate),
        updatedAt: Timestamp.fromDate(someDate),
      } as LiveSessionData;

      expect(getSession(sessionData)).toEqual({
        id: 'some-session-id',
        createdAt: '2022-11-16T00:00:00.000Z',
        startTime: '2022-11-16T00:00:00.000Z',
        updatedAt: '2022-11-16T00:00:00.000Z',
      });
    });
  });

  describe('getSessionState', () => {
    it('should transform session state data firestore timestamps into dates', async () => {
      const someDate = new Date('2022-11-16');
      const sessionStateData = {
        id: 'some-session-id',
        timestamp: Timestamp.fromDate(someDate),
      } as SessionStateData;

      expect(getSessionState(sessionStateData)).toEqual({
        id: 'some-session-id',
        timestamp: '2022-11-16T00:00:00.000Z',
      });
    });
  });
});

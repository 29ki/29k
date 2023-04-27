import {mockFirebase} from 'firestore-jest-mock';

mockFirebase(
  {
    database: {
      sessions: [],
    },
  },
  {includeIdsInData: true, mutable: true},
);

import {
  mockCollection,
  mockGetTransaction,
  mockOrderBy,
  mockRunTransaction,
  mockUpdateTransaction,
  mockWhere,
  mockDelete,
  mockDoc,
  mockLimit,
} from 'firestore-jest-mock/mocks/firestore';
import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';

import {
  addSession,
  deleteSession,
  getSessionById,
  getSessionByInviteCode,
  getSessionsByUserId,
  updateSessionState,
  updateSession,
  getSessionStateById,
  updateInterestedCount,
  getUpcomingPublicSessions,
} from './session';
import {SessionType} from '../../../shared/src/schemas/Session';

const sessions = [
  {
    id: 'some-session-id',
    name: 'some-name',
    url: 'some-url',
    hostId: 'some-user-id',
    exerciseId: 'some-exercise-id',
    type: SessionType.public,
    startTime: Timestamp.now(),
    userIds: ['*'],
    interestedCount: 0,
    closingTime: Timestamp.now(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    _collections: {
      state: [
        {
          id: 'some-session-id',
          index: 0,
          playing: false,
          started: false,
          ended: false,
          timestamp: Timestamp.now(),
        },
      ],
    },
  },
  {
    id: 'some-other-session-id',
    name: 'some-other-name',
    url: 'some-other-url',
    hostId: 'some-other-user-id',
    exerciseId: 'some-exercise-id',
    startTime: Timestamp.now(),
    type: SessionType.public,
    userIds: ['*'],
    interestedCount: 1,
    closingTime: Timestamp.now(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    _collections: {
      state: [
        {
          id: 'some-other-session-id',
          index: 0,
          playing: false,
          timestamp: Timestamp.now(),
        },
      ],
    },
  },
];

beforeEach(
  async () =>
    await Promise.all(
      sessions.map(session =>
        Promise.all([
          firestore()
            .collection('sessions')
            .doc(session.id)
            .collection('state')
            .doc(session.id)
            .set(session._collections.state[0]),
          firestore().collection('sessions').doc(session.id).set(session),
        ]),
      ),
    ),
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('session model', () => {
  describe('getSessionById', () => {
    it('should get a session by its id', async () => {
      const session = await getSessionById('some-session-id');
      expect(session).toEqual({
        hostId: 'some-user-id',
        id: 'some-session-id',
        name: 'some-name',
        exerciseId: 'some-exercise-id',
        startTime: expect.any(Timestamp),
        closingTime: expect.any(Timestamp),
        url: 'some-url',
        type: 'public',
        userIds: ['*'],
        interestedCount: 0,
        createdAt: expect.any(Timestamp),
        updatedAt: expect.any(Timestamp),
      });
    });

    it('should return undefined if no session is found', async () => {
      const session = await getSessionById('some-non-existing-session-id');
      expect(session).toBe(undefined);
    });
  });

  describe('getSessionByInviteCode', () => {
    it('should get a session by its invite', async () => {
      await getSessionByInviteCode({inviteCode: 12345});
      expect(mockWhere).toHaveBeenCalledWith('inviteCode', '==', 12345);
      expect(mockWhere).toHaveBeenCalledWith('ended', '==', false);
      expect(mockWhere).toHaveBeenCalledWith(
        'closingTime',
        '>',
        expect.any(Timestamp),
      );
    });
  });

  describe('getSessionsByUserId', () => {
    it('should get sessions', async () => {
      const sessions = await getSessionsByUserId('some-non-id');
      expect(sessions).toEqual([
        {
          hostId: 'some-user-id',
          id: 'some-session-id',
          name: 'some-name',
          exerciseId: 'some-exercise-id',
          startTime: expect.any(Timestamp),
          closingTime: expect.any(Timestamp),
          url: 'some-url',
          type: 'public',
          userIds: ['*'],
          interestedCount: 0,
          createdAt: expect.any(Timestamp),
          updatedAt: expect.any(Timestamp),
        },
        {
          hostId: 'some-other-user-id',
          id: 'some-other-session-id',
          name: 'some-other-name',
          exerciseId: 'some-exercise-id',
          startTime: expect.any(Timestamp),
          closingTime: expect.any(Timestamp),
          url: 'some-other-url',
          type: 'public',
          userIds: ['*'],
          interestedCount: 1,
          createdAt: expect.any(Timestamp),
          updatedAt: expect.any(Timestamp),
        },
      ]);
    });

    it('should filter out old sessions', async () => {
      await getSessionsByUserId('some-user-id');
      expect(mockWhere).toHaveBeenCalledWith('ended', '==', false);
      expect(mockWhere).toHaveBeenCalledWith(
        'closingTime',
        '>',
        expect.any(Timestamp),
      );
    });

    it('should filter for public sessions and by user id', async () => {
      await getSessionsByUserId('some-user-id');
      expect(mockWhere).toHaveBeenCalledWith('userIds', 'array-contains-any', [
        '*',
        'some-user-id',
      ]);
    });

    it('supports support filtering by exercises id', async () => {
      await getSessionsByUserId('some-user-id', 'some-exercise-id');
      expect(mockWhere).toHaveBeenCalledWith(
        'exerciseId',
        '==',
        'some-exercise-id',
      );
    });

    it('should order by startime', async () => {
      await getSessionsByUserId('some-user-id');
      expect(mockOrderBy).toHaveBeenCalledWith('startTime', 'asc');
    });

    it('supports limiting query result', async () => {
      await getSessionsByUserId('some-user-id', undefined, undefined, 5);
      expect(mockLimit).toHaveBeenCalledWith(5);
    });
  });

  describe('getUpcomingPublicSessions', () => {
    it('should get upcoming public sessions', async () => {
      const sessions = await getUpcomingPublicSessions();

      expect(sessions).toEqual([
        {
          hostId: 'some-user-id',
          id: 'some-session-id',
          name: 'some-name',
          exerciseId: 'some-exercise-id',
          startTime: expect.any(Timestamp),
          closingTime: expect.any(Timestamp),
          url: 'some-url',
          type: 'public',
          userIds: ['*'],
          interestedCount: 0,
          createdAt: expect.any(Timestamp),
          updatedAt: expect.any(Timestamp),
        },
        {
          hostId: 'some-other-user-id',
          id: 'some-other-session-id',
          name: 'some-other-name',
          exerciseId: 'some-exercise-id',
          startTime: expect.any(Timestamp),
          closingTime: expect.any(Timestamp),
          url: 'some-other-url',
          type: 'public',
          userIds: ['*'],
          interestedCount: 1,
          createdAt: expect.any(Timestamp),
          updatedAt: expect.any(Timestamp),
        },
      ]);
    });

    it('should only return public sessions', async () => {
      await getUpcomingPublicSessions();
      expect(mockWhere).toHaveBeenCalledWith('type', '==', 'public');
    });

    it('should filter out old sessions', async () => {
      await getUpcomingPublicSessions();
      expect(mockWhere).toHaveBeenCalledWith('ended', '==', false);
      expect(mockWhere).toHaveBeenCalledWith(
        'startTime',
        '>',
        expect.any(Timestamp),
      );
    });

    it('should order by startime', async () => {
      await getUpcomingPublicSessions();
      expect(mockOrderBy).toHaveBeenCalledWith('startTime', 'asc');
    });

    it('supports limiting query result', async () => {
      await getUpcomingPublicSessions(5);
      expect(mockLimit).toHaveBeenCalledWith(5);
    });
  });

  describe('addSession', () => {
    const startTime = Timestamp.fromDate(new Date('1994-03-08T07:30:00'));
    const closingTime = Timestamp.fromDate(new Date('1994-03-08T08:00:00'));

    it('should return public session', async () => {
      const session = await addSession({
        id: 'session-id',
        language: 'en',
        dailyRoomName: 'daily-room-name',
        url: 'daily-url',
        exerciseId: 'content-id',
        link: 'deep-link',
        type: SessionType.public,
        startTime: startTime.toDate().toISOString(),
        hostId: 'some-user-id',
        inviteCode: 1234,
        interestedCount: 0,
      });

      expect(session).toEqual({
        exerciseId: 'content-id',
        language: 'en',
        dailyRoomName: 'daily-room-name',
        hostId: 'some-user-id',
        id: 'session-id',
        link: 'deep-link',
        startTime,
        closingTime,
        type: 'public',
        mode: 'live',
        url: 'daily-url',
        ended: false,
        userIds: ['*'],
        inviteCode: 1234,
        interestedCount: 0,
        createdAt: expect.any(Timestamp),
        updatedAt: expect.any(Timestamp),
      });
    });

    it('should return private session', async () => {
      const session = await addSession({
        id: 'session-id',
        language: 'en',
        dailyRoomName: 'daily-room-name',
        url: 'daily-url',
        exerciseId: 'content-id',
        link: 'deep-link',
        type: SessionType.private,
        startTime: startTime.toDate().toISOString(),
        hostId: 'some-user-id',
        inviteCode: 1234,
        interestedCount: 0,
      });

      expect(session).toEqual({
        exerciseId: 'content-id',
        language: 'en',
        dailyRoomName: 'daily-room-name',
        hostId: 'some-user-id',
        id: 'session-id',
        link: 'deep-link',
        startTime,
        type: 'private',
        mode: 'live',
        url: 'daily-url',
        userIds: ['some-user-id'],
        ended: false,
        inviteCode: 1234,
        interestedCount: 0,
        closingTime,
        createdAt: expect.any(Timestamp),
        updatedAt: expect.any(Timestamp),
      });
    });
  });

  describe('updateSession', () => {
    it('should return updated session with type', async () => {
      await updateSession('some-session-id', {type: SessionType.private});
      const session = await getSessionById('some-session-id');

      expect(session).toEqual({
        id: 'some-session-id',
        name: 'some-name',
        url: 'some-url',
        hostId: 'some-user-id',
        exerciseId: 'some-exercise-id',
        interestedCount: 0,
        startTime: expect.any(Timestamp),
        closingTime: expect.any(Timestamp),
        type: SessionType.private,
        userIds: ['*'],
        createdAt: expect.any(Timestamp),
        updatedAt: expect.any(Timestamp),
      });
    });

    it('should return updated session with startTime and closingTime', async () => {
      const startTime = new Date('1994-03-08T07:00:00.000Z').toISOString();
      await updateSession('some-session-id', {startTime});
      const session = await getSessionById('some-session-id');

      expect(session).toEqual({
        id: 'some-session-id',
        name: 'some-name',
        url: 'some-url',
        hostId: 'some-user-id',
        exerciseId: 'some-exercise-id',
        type: 'public',
        interestedCount: 0,
        startTime: Timestamp.fromDate(new Date('1994-03-08T07:00:00.000Z')),
        closingTime: Timestamp.fromDate(new Date('1994-03-08T07:30:00.000Z')),
        userIds: ['*'],
        createdAt: expect.any(Timestamp),
        updatedAt: expect.any(Timestamp),
      });
    });
  });

  describe('updateInterestedCount', () => {
    it('should increment interested count', async () => {
      await updateInterestedCount('some-session-id', true);
      const session = await getSessionById('some-session-id');

      expect(mockRunTransaction).toHaveBeenCalledTimes(1);
      expect(mockUpdateTransaction).toHaveBeenCalledTimes(1);
      expect(mockGetTransaction).toHaveBeenCalledTimes(1);
      expect(session).toMatchObject({interestedCount: 1});
    });

    it('should decrease interested count', async () => {
      await updateInterestedCount('some-other-session-id', false);
      const session = await getSessionById('some-other-session-id');

      expect(mockRunTransaction).toHaveBeenCalledTimes(1);
      expect(mockUpdateTransaction).toHaveBeenCalledTimes(1);
      expect(mockGetTransaction).toHaveBeenCalledTimes(1);
      expect(session).toMatchObject({interestedCount: 0});
    });

    it('should not decrease interested count of zero', async () => {
      await updateInterestedCount('some-other-session-id', false);
      const session = await getSessionById('some-session-id');

      expect(mockRunTransaction).toHaveBeenCalledTimes(1);
      expect(mockUpdateTransaction).toHaveBeenCalledTimes(1);
      expect(mockGetTransaction).toHaveBeenCalledTimes(1);
      expect(session).toMatchObject({interestedCount: 0});
    });
  });

  describe('updateSessionState', () => {
    it('should update playing', async () => {
      await updateSessionState('some-session-id', {
        playing: true,
      });
      const state = await getSessionStateById('some-session-id');

      expect(mockRunTransaction).toHaveBeenCalledTimes(1);
      expect(mockUpdateTransaction).toHaveBeenCalledTimes(1);
      expect(mockGetTransaction).toHaveBeenCalledTimes(1);
      expect(state).toEqual({
        ended: false,
        id: 'some-session-id',
        index: 0,
        playing: true,
        started: false,
        timestamp: expect.any(Timestamp),
      });
    });

    it('should update index', async () => {
      await updateSessionState('some-session-id', {
        index: 2,
      });
      const state = await getSessionStateById('some-session-id');

      expect(state).toEqual({
        index: 2,
        playing: true,
        timestamp: expect.any(Timestamp),
        ended: false,
        id: 'some-session-id',
        started: false,
      });
    });
  });

  describe('deleteSession', () => {
    it('should delete and confirm on response', async () => {
      await deleteSession('some-session-id');

      expect(mockCollection).toHaveBeenCalledWith('sessions');
      expect(mockDoc).toHaveBeenCalledWith('some-session-id');
      expect(mockCollection).toHaveBeenCalledWith('state');
      expect(mockDoc).toHaveBeenCalledWith('some-session-id');
      expect(mockDelete).toHaveBeenCalledTimes(2);
    });
  });
});

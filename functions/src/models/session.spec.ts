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
} from 'firestore-jest-mock/mocks/firestore';
import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';

import {
  addSession,
  deleteSession,
  getSessionById,
  getSessionByInviteCode,
  getSessions,
  updateExerciseState,
  updateSession,
} from './session';
import {SessionType} from '../../../shared/src/types/Session';

const sessions = [
  {
    id: 'some-session-id',
    name: 'some-name',
    url: 'some-url',
    exerciseState: {
      index: 0,
      playing: false,
      timestamp: Timestamp.now(),
    },
    facilitator: 'some-user-id',
    startTime: Timestamp.now(),
    started: false,
    ended: false,
    userIds: ['*'],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: 'some-other-session-id',
    name: 'some-other-name',
    url: 'some-other-url',
    exerciseState: {
      index: 0,
      playing: false,
      timestamp: Timestamp.now(),
    },
    facilitator: 'some-other-user-id',
    startTime: Timestamp.now(),
    started: false,
    ended: false,
    userIds: ['*'],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

beforeEach(async () => {
  await Promise.all(
    sessions.map(session =>
      firestore().collection('sessions').doc(session.id).set(session),
    ),
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('session model', () => {
  describe('getSessionById', () => {
    it('should get a session by its id', async () => {
      const session = await getSessionById('some-session-id');
      expect(session).toEqual({
        ended: false,
        exerciseState: {
          index: 0,
          playing: false,
          timestamp: expect.any(String),
        },
        facilitator: 'some-user-id',
        id: 'some-session-id',
        name: 'some-name',
        startTime: expect.any(String),
        started: false,
        url: 'some-url',
        userIds: ['*'],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return undefined if no session is found', async () => {
      const session = await getSessionById('some-non-existing-session-id');
      expect(session).toBe(undefined);
    });
  });

  describe('getSessionByInviteCode', () => {
    it('should get a session by its invite', async () => {
      await getSessionByInviteCode(12345);
      expect(mockWhere).toHaveBeenCalledWith('inviteCode', '==', 12345);
      expect(mockWhere).toHaveBeenCalledWith('ended', '==', false);
      expect(mockWhere).toHaveBeenCalledWith(
        'startTime',
        '>',
        expect.any(Timestamp),
      );
    });
  });

  describe('getSessions', () => {
    it('should get sessions', async () => {
      const sessions = await getSessions('some-non-id');
      expect(sessions).toEqual([
        {
          ended: false,
          exerciseState: {
            index: 0,
            playing: false,
            timestamp: expect.any(String),
          },
          facilitator: 'some-user-id',
          id: 'some-session-id',
          name: 'some-name',
          startTime: expect.any(String),
          started: false,
          url: 'some-url',
          userIds: ['*'],
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          ended: false,
          exerciseState: {
            index: 0,
            playing: false,
            timestamp: expect.any(String),
          },
          facilitator: 'some-other-user-id',
          id: 'some-other-session-id',
          name: 'some-other-name',
          startTime: expect.any(String),
          started: false,
          url: 'some-other-url',
          userIds: ['*'],
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });

    it('should filter out old sessions', async () => {
      await getSessions('some-user-id');
      expect(mockWhere).toHaveBeenCalledWith('ended', '==', false);
      expect(mockWhere).toHaveBeenCalledWith(
        'startTime',
        '>',
        expect.any(Timestamp),
      );
    });

    it('should filter for public sessions and sessions that the user belongs to', async () => {
      await getSessions('some-user-id');
      expect(mockWhere).toHaveBeenCalledWith('userIds', 'array-contains-any', [
        '*',
        'some-user-id',
      ]);
    });

    it('should order by startime', async () => {
      await getSessions('some-user-id');
      expect(mockOrderBy).toHaveBeenCalledWith('startTime', 'asc');
    });
  });

  describe('addSession', () => {
    const startTime = new Date('1994-03-08T07:24:00').toISOString();

    it('should return public session', async () => {
      const session = await addSession({
        id: 'session-id',
        language: 'en',
        dailyRoomName: 'daily-room-name',
        url: 'daily-url',
        contentId: 'content-id',
        link: 'deep-link',
        type: SessionType.public,
        startTime: startTime,
        facilitator: 'some-user-id',
        inviteCode: 1234,
      });

      expect(session).toEqual({
        contentId: 'content-id',
        language: 'en',
        dailyRoomName: 'daily-room-name',
        ended: false,
        exerciseState: {
          index: 0,
          playing: false,
          timestamp: expect.any(String),
        },
        facilitator: 'some-user-id',
        id: 'session-id',
        link: 'deep-link',
        startTime: startTime,
        started: false,
        type: 'public',
        url: 'daily-url',
        userIds: ['*'],
        inviteCode: 1234,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return private session', async () => {
      const session = await addSession({
        id: 'session-id',
        language: 'en',
        dailyRoomName: 'daily-room-name',
        url: 'daily-url',
        contentId: 'content-id',
        link: 'deep-link',
        type: SessionType.private,
        startTime: startTime,
        facilitator: 'some-user-id',
        inviteCode: 1234,
      });

      expect(session).toEqual({
        contentId: 'content-id',
        language: 'en',
        dailyRoomName: 'daily-room-name',
        ended: false,
        exerciseState: {
          index: 0,
          playing: false,
          timestamp: expect.any(String),
        },
        facilitator: 'some-user-id',
        id: 'session-id',
        link: 'deep-link',
        startTime: startTime,
        started: false,
        type: 'private',
        url: 'daily-url',
        userIds: ['some-user-id'],
        inviteCode: 1234,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  describe('updateSession', () => {
    it('should return updated session with started', async () => {
      await updateSession('some-session-id', {started: true});
      const session = await getSessionById('some-session-id');
      expect(session).toEqual({
        id: 'some-session-id',
        name: 'some-name',
        url: 'some-url',
        exerciseState: {
          index: 0,
          playing: false,
          timestamp: expect.any(String),
        },
        facilitator: 'some-user-id',
        startTime: expect.any(String),
        started: true,
        ended: false,
        userIds: ['*'],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return updated session with ended', async () => {
      await updateSession('some-session-id', {ended: true});
      const session = await getSessionById('some-session-id');
      expect(session).toEqual({
        id: 'some-session-id',
        name: 'some-name',
        url: 'some-url',
        exerciseState: {
          index: 0,
          playing: false,
          timestamp: expect.any(String),
        },
        facilitator: 'some-user-id',
        startTime: expect.any(String),
        started: false,
        ended: true,
        userIds: ['*'],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  describe('updateExerciseState', () => {
    it('should update playing', async () => {
      await updateExerciseState('some-session-id', {
        playing: true,
      });
      const session = await getSessionById('some-session-id');

      expect(mockRunTransaction).toHaveBeenCalledTimes(1);
      expect(mockUpdateTransaction).toHaveBeenCalledTimes(1);
      expect(mockGetTransaction).toHaveBeenCalledTimes(1);
      expect(session).toEqual({
        ended: false,
        exerciseState: {
          index: 0,
          playing: true,
          timestamp: expect.any(String),
        },
        facilitator: 'some-user-id',
        id: 'some-session-id',
        name: 'some-name',
        startTime: expect.any(String),
        started: false,
        url: 'some-url',
        userIds: ['*'],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should update index', async () => {
      await updateExerciseState('some-session-id', {
        index: 2,
      });
      const session = await getSessionById('some-session-id');

      expect(session).toEqual({
        id: 'some-session-id',
        name: 'some-name',
        url: 'some-url',
        exerciseState: {
          index: 2,
          playing: false,
          timestamp: expect.any(String),
        },
        facilitator: 'some-user-id',
        startTime: expect.any(String),
        started: false,
        ended: false,
        userIds: ['*'],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should update dailySpotlightId', async () => {
      await updateExerciseState('some-session-id', {
        dailySpotlightId: 'some-user-id',
      });
      const session = await getSessionById('some-session-id');

      expect(session).toEqual({
        id: 'some-session-id',
        name: 'some-name',
        url: 'some-url',
        exerciseState: {
          index: 0,
          playing: false,
          dailySpotlightId: 'some-user-id',
          timestamp: expect.any(String),
        },
        facilitator: 'some-user-id',
        startTime: expect.any(String),
        started: false,
        ended: false,
        userIds: ['*'],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  describe('deleteSession', () => {
    it('should delete and confirm on response', async () => {
      await deleteSession('some-session-id');

      expect(mockCollection).toHaveBeenCalledWith('sessions');
      expect(mockDoc).toHaveBeenCalledWith('some-session-id');
      expect(mockDelete).toHaveBeenCalledTimes(1);
    });
  });
});

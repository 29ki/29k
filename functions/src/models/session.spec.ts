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
  updateSessionState,
  updateSession,
  getSessionStateById,
  updateInterestedCount,
} from './session';
import {SessionType} from '../../../shared/src/types/Session';

const sessions = [
  {
    id: 'some-session-id',
    name: 'some-name',
    url: 'some-url',
    hostId: 'some-user-id',
    type: SessionType.public,
    startTime: Timestamp.now(),
    userIds: ['*'],
    interestedCount: 0,
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
    startTime: Timestamp.now(),
    type: SessionType.public,
    userIds: ['*'],
    interestedCount: 1,
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
        startTime: expect.any(String),
        url: 'some-url',
        type: 'public',
        userIds: ['*'],
        interestedCount: 0,
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
      await getSessionByInviteCode({inviteCode: 12345});
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
          hostId: 'some-user-id',
          id: 'some-session-id',
          name: 'some-name',
          startTime: expect.any(String),
          url: 'some-url',
          type: 'public',
          userIds: ['*'],
          interestedCount: 0,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          hostId: 'some-other-user-id',
          id: 'some-other-session-id',
          name: 'some-other-name',
          startTime: expect.any(String),
          url: 'some-other-url',
          type: 'public',
          userIds: ['*'],
          interestedCount: 1,
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
        exerciseId: 'content-id',
        link: 'deep-link',
        type: SessionType.public,
        startTime: startTime,
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
        startTime: startTime,
        type: 'public',
        mode: 'live',
        url: 'daily-url',
        ended: false,
        userIds: ['*'],
        inviteCode: 1234,
        interestedCount: 0,
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
        exerciseId: 'content-id',
        link: 'deep-link',
        type: SessionType.private,
        startTime: startTime,
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
        startTime: startTime,
        type: 'private',
        mode: 'live',
        url: 'daily-url',
        userIds: ['some-user-id'],
        ended: false,
        inviteCode: 1234,
        interestedCount: 0,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
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
        interestedCount: 0,
        startTime: expect.any(String),
        type: SessionType.private,
        userIds: ['*'],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return updated session with startTime', async () => {
      const startTime = new Date('1994-03-08T07:24:00').toISOString();
      await updateSession('some-session-id', {startTime});
      const session = await getSessionById('some-session-id');

      expect(session).toEqual({
        id: 'some-session-id',
        name: 'some-name',
        url: 'some-url',
        hostId: 'some-user-id',
        type: 'public',
        interestedCount: 0,
        startTime: expect.any(String),
        userIds: ['*'],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
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
        timestamp: expect.any(String),
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
        timestamp: expect.any(String),
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

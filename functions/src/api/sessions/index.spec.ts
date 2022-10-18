import request from 'supertest';
import {mockFirebase} from 'firestore-jest-mock';
import Koa from 'koa';

mockFirebase(
  {
    database: {
      sessions: [],
    },
  },
  {includeIdsInData: true, mutable: true},
);

const mockDailyApi = {
  createRoom: jest.fn(() => ({
    id: 'some-fake-daily-id',
    url: 'http://fake.daily/url',
  })),
  deleteRoom: jest.fn(),
};

const mockDynamicLinks = {
  createDynamicLink: jest.fn().mockResolvedValue('http://some.dynamic/link'),
};

import {sessionsRouter} from '.';
import createMockServer from '../lib/createMockServer';
import {
  mockGetTransaction,
  mockOrderBy,
  mockRunTransaction,
  mockUpdate,
  mockUpdateTransaction,
  mockWhere,
} from 'firestore-jest-mock/mocks/firestore';
import {createRouter} from '../../lib/routers';
import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';

jest.mock('../../lib/dailyApi', () => mockDailyApi);
jest.mock('../../lib/dynamicLinks', () => mockDynamicLinks);

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
  },
];

const router = createRouter();
router.use('/sessions', sessionsRouter.routes());
const mockServer = createMockServer(
  async (ctx: Koa.Context, next: Koa.Next) => {
    ctx.user = {
      id: 'some-user-id',
    };
    await next();
  },
  router.routes(),
  router.allowedMethods(),
);

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

afterAll(() => {
  mockServer.close();
});

describe('/api/sessions', () => {
  describe('GET', () => {
    it('should get sessions', async () => {
      const response = await request(mockServer).get('/sessions');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
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
          ended: false,
        },
        {
          id: 'some-other-session-id',
          name: 'some-other-name',
          url: 'some-other-url',
          exerciseState: {
            index: 0,
            playing: false,
            timestamp: expect.any(String),
          },
          facilitator: 'some-other-user-id',
          startTime: expect.any(String),
          started: false,
          ended: false,
        },
      ]);
    });

    it('should filter out old sessions', async () => {
      await request(mockServer).get('/sessions');
      expect(mockWhere).toHaveBeenCalledWith('ended', '==', false);
      expect(mockWhere).toHaveBeenCalledWith(
        'startTime',
        '>',
        expect.any(Timestamp),
      );
    });

    it('should order by startTime', async () => {
      await request(mockServer).get('/sessions');
      expect(mockOrderBy).toHaveBeenCalledWith('startTime', 'asc');
    });
  });

  describe('POST', () => {
    const startTime = new Date('1994-03-08T07:24:00').toISOString();

    it('should return newly created session', async () => {
      const response = await request(mockServer)
        .post('/sessions')
        .send({
          contentId: 'some-content-id',
          type: 'public',
          startTime,
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'some-fake-daily-id',
        url: 'http://fake.daily/url',
        link: 'http://some.dynamic/link',
        exerciseState: {
          index: 0,
          playing: false,
          timestamp: expect.any(String),
        },
        contentId: 'some-content-id',
        facilitator: 'some-user-id',
        startTime: startTime,
        started: false,
        ended: false,
        type: 'public',
      });
    });

    it('should fail without session data', async () => {
      const response = await request(mockServer)
        .post('/sessions')
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });

    it('should fail if daily api fails', async () => {
      mockDailyApi.createRoom.mockRejectedValueOnce(
        new Error('some error text') as never,
      );
      const response = await request(mockServer)
        .post('/sessions')
        .send({name: 'the name'});
      expect(response.status).toBe(500);
    });
  });

  describe('PUT', () => {
    it('should return updated session with started', async () => {
      const response = await request(mockServer)
        .put('/sessions/some-session-id')
        .send({started: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
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
      });
    });

    it('should return updated session with ended', async () => {
      const response = await request(mockServer)
        .put('/sessions/some-session-id')
        .send({ended: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
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
      });
    });

    it('should fail on invalid fields', async () => {
      const response = await request(mockServer)
        .put('/sessions/some-session-id')
        .send({invalidField: 'some-value'})
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
    });

    it('should fail when request auth user is not facilitator', async () => {
      const response = await request(mockServer)
        .put('/sessions/some-other-session-id')
        .send({started: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });
  });

  describe('PUT /:id/exerciseState', () => {
    it('runs in a transaction', async () => {
      await request(mockServer)
        .put('/sessions/some-session-id/exerciseState')
        .send({playing: true})
        .set('Accept', 'application/json');

      expect(mockRunTransaction).toHaveBeenCalledTimes(1);
      expect(mockUpdateTransaction).toHaveBeenCalledTimes(1);
      expect(mockGetTransaction).toHaveBeenCalledTimes(1);
    });

    it('should update index', async () => {
      const response = await request(mockServer)
        .put('/sessions/some-session-id/exerciseState')
        .send({index: 2})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
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
      });
    });

    it('should update playing', async () => {
      const response = await request(mockServer)
        .put('/sessions/some-session-id/exerciseState')
        .send({playing: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'some-session-id',
        name: 'some-name',
        url: 'some-url',
        exerciseState: {
          index: 0,
          playing: true,
          timestamp: expect.any(String),
        },
        facilitator: 'some-user-id',
        startTime: expect.any(String),
        started: false,
        ended: false,
      });
    });

    it('should update dailySpotlightId', async () => {
      const response = await request(mockServer)
        .put('/sessions/some-session-id/exerciseState')
        .send({dailySpotlightId: 'some-user-id'})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
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
      });
    });

    it('should fail when request auth user is not facilitator', async () => {
      const response = await request(mockServer)
        .put('/sessions/some-other-session-id/exerciseState')
        .send({playing: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });

    it('should require a field', async () => {
      const response = await request(mockServer)
        .put('/sessions/some-session-id/exerciseState')
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
      expect(mockUpdate).toHaveBeenCalledTimes(0);
    });

    it('does not accept other fields', async () => {
      const response = await request(mockServer)
        .put('/sessions/some-session-id/exerciseState')
        .send({index: 1, foo: 'bar'})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(mockUpdateTransaction).toHaveBeenCalledTimes(1);
      expect(mockUpdateTransaction).toHaveBeenCalledWith(expect.any(Object), {
        exerciseState: {
          index: 1,
          playing: false,
          timestamp: expect.any(Object),
        },
      });
    });

    it('should return 500 on non-existing session', async () => {
      const response = await request(mockServer)
        .put('/sessions/some-non-existing-id/exerciseState')
        .send({index: 1})
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
      expect(mockUpdate).toHaveBeenCalledTimes(0);
    });
  });

  describe('DELETE', () => {
    it('should delete and confirm on response', async () => {
      const response = await request(mockServer)
        .delete('/sessions/some-session-id')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.text).toEqual('Session deleted successfully');
    });

    it('should fail when non-existing session id', async () => {
      const response = await request(mockServer)
        .delete('/sessions/some-non-existent-session-id')
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });

    it('should fail when request auth user is not facilitator', async () => {
      const response = await request(mockServer)
        .delete('/sessions/some-other-session-id')
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });
  });
});

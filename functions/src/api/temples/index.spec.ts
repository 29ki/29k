import request from 'supertest';
import {mockFirebase} from 'firestore-jest-mock';
import Koa from 'koa';

mockFirebase(
  {
    database: {
      temples: [],
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

import {templesRouter} from '.';
import createMockServer from '../lib/createMockServer';
import {
  mockGetTransaction,
  mockRunTransaction,
  mockUpdate,
  mockUpdateTransaction,
} from 'firestore-jest-mock/mocks/firestore';
import {createRouter} from '../../lib/routers';
import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';

jest.mock('../../lib/dailyApi', () => mockDailyApi);

const temples = [
  {
    id: 'some-temple-id',
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
    id: 'some-other-temple-id',
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
router.use('/temples', templesRouter.routes());
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
    temples.map(temple =>
      firestore().collection('temples').doc(temple.id).set(temple),
    ),
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockServer.close();
});

describe('/api/temples', () => {
  describe('GET', () => {
    it('should get temples', async () => {
      const response = await request(mockServer).get('/temples');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 'some-temple-id',
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
          id: 'some-other-temple-id',
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
  });

  describe('POST', () => {
    const startTime = new Date('1994-03-08T07:24:00').toISOString();

    it('should return newly created temple', async () => {
      const response = await request(mockServer)
        .post('/temples')
        .send({
          name: 'the next big temple!',
          contentId: 'some-content-id',
          startTime,
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'some-fake-daily-id',
        name: 'the next big temple!',
        url: 'http://fake.daily/url',
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
      });
    });

    it('should require a name', async () => {
      const response = await request(mockServer)
        .post('/temples')
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });

    it('should fail if daily api fails', async () => {
      mockDailyApi.createRoom.mockRejectedValueOnce(
        new Error('some error text') as never,
      );
      const response = await request(mockServer)
        .post('/temples')
        .send({name: 'the name'});
      expect(response.status).toBe(500);
    });
  });

  describe('PUT', () => {
    it('should return updated temple with started', async () => {
      const response = await request(mockServer)
        .put('/temples/some-temple-id')
        .send({started: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'some-temple-id',
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

    it('should return updated temple with ended', async () => {
      const response = await request(mockServer)
        .put('/temples/some-temple-id')
        .send({ended: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'some-temple-id',
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
        .put('/temples/some-temple-id')
        .send({invalidField: 'some-value'})
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
    });

    it('should fail when request auth user is not facilitator', async () => {
      const response = await request(mockServer)
        .put('/temples/some-other-temple-id')
        .send({started: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });
  });

  describe('PUT /:id/exerciseState', () => {
    it('runs in a transaction', async () => {
      await request(mockServer)
        .put('/temples/some-temple-id/exerciseState')
        .send({playing: true})
        .set('Accept', 'application/json');

      expect(mockRunTransaction).toHaveBeenCalledTimes(1);
      expect(mockUpdateTransaction).toHaveBeenCalledTimes(1);
      expect(mockGetTransaction).toHaveBeenCalledTimes(1);
    });

    it('should update index', async () => {
      const response = await request(mockServer)
        .put('/temples/some-temple-id/exerciseState')
        .send({index: 2})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'some-temple-id',
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
        .put('/temples/some-temple-id/exerciseState')
        .send({playing: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'some-temple-id',
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
        .put('/temples/some-temple-id/exerciseState')
        .send({dailySpotlightId: 'some-user-id'})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'some-temple-id',
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
        .put('/temples/some-other-temple-id/exerciseState')
        .send({playing: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });

    it('should require a field', async () => {
      const response = await request(mockServer)
        .put('/temples/some-temple-id/exerciseState')
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
      expect(mockUpdate).toHaveBeenCalledTimes(0);
    });

    it('does not accept other fields', async () => {
      const response = await request(mockServer)
        .put('/temples/some-temple-id/exerciseState')
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

    it('should return 500 on non-existing temple', async () => {
      const response = await request(mockServer)
        .put('/temples/some-non-existing-id/exerciseState')
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
        .delete('/temples/some-temple-id')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.text).toEqual('Temple deleted successfully');
    });

    it('should fail when non-existing temple id', async () => {
      const response = await request(mockServer)
        .delete('/temples/some-non-existent-temple-id')
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });

    it('should fail when request auth user is not facilitator', async () => {
      const response = await request(mockServer)
        .delete('/temples/some-other-temple-id')
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });
  });
});

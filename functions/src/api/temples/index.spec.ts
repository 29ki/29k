import request from 'supertest';
import Router from '@koa/router';
import {mockFirebase} from 'firestore-jest-mock';

mockFirebase(
  {
    database: {
      temples: [
        {
          active: false,
          id: 'some-temple-id',
          name: 'some-name',
          url: 'some-url',
          index: 0,
        },
        {
          active: true,
          id: 'some-other-temple-id',
          name: 'some-other-name',
          url: 'some-other-url',
          index: 0,
        },
        {
          active: true,
          id: 'update-index-doc-id',
          name: 'update-index-doc-name',
          url: 'update-index-doc-url',
          index: 0,
        },
        {
          active: true,
          id: 'update-active-doc-id',
          name: 'update-active-doc-name',
          url: 'update-active-doc-url',
          index: 0,
        },
      ],
    },
  },
  {includeIdsInData: true, mutable: true},
);

const mockDailyApi = {
  createRoom: jest.fn(() => ({
    id: 'some-fake-daily-id',
    url: 'http://fake.daily/url',
  })),
};

import {templesRouter} from '.';
import createMockServer from '../lib/createMockServer';

jest.mock('../../lib/dailyApi', () => mockDailyApi);

const router = new Router();
router.use('/temples', templesRouter.routes());
const mockServer = createMockServer(router.routes(), router.allowedMethods());

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
          active: false,
          id: 'some-temple-id',
          name: 'some-name',
          url: 'some-url',
          index: 0,
        },
        {
          active: true,
          id: 'some-other-temple-id',
          name: 'some-other-name',
          url: 'some-other-url',
          index: 0,
        },
        {
          active: true,
          id: 'update-index-doc-id',
          name: 'update-index-doc-name',
          url: 'update-index-doc-url',
          index: 0,
        },
        {
          active: true,
          id: 'update-active-doc-id',
          name: 'update-active-doc-name',
          url: 'update-active-doc-url',
          index: 0,
        },
      ]);
    });
  });

  describe('POST', () => {
    it('should return newly created temple', async () => {
      const response = await request(mockServer)
        .post('/temples')
        .send({name: 'the next big temple!'})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        active: false,
        id: 'some-fake-daily-id',
        name: 'the next big temple!',
        url: 'http://fake.daily/url',
        index: 0,
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

  describe('PUT /:id/index', () => {
    const templeId = 'update-index-doc-id';

    it('should update index', async () => {
      const response = await request(mockServer)
        .put(`/temples/${templeId}/index`)
        .send({index: 2})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        active: true,
        id: 'update-index-doc-id',
        index: 2,
        name: 'update-index-doc-name',
        url: 'update-index-doc-url',
      });
    });

    it('should require an index field', async () => {
      const response = await request(mockServer)
        .put(`/temples/${templeId}/index`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });
  });

  describe('PUT /:id/active', () => {
    const templeId = 'update-active-doc-id';

    it('should update active', async () => {
      const response = await request(mockServer)
        .put(`/temples/${templeId}/active`)
        .send({active: false})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        active: false,
        id: 'update-active-doc-id',
        index: 0,
        name: 'update-active-doc-name',
        url: 'update-active-doc-url',
      });
    });

    it('should require active field', async () => {
      const response = await request(mockServer)
        .put(`/temples/${templeId}/active`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });
  });
});

import request from 'supertest';
import Router from '@koa/router';
import {mockFirebase} from 'firestore-jest-mock';

mockFirebase(
  {
    database: {
      temples: [
        {
          id: 'some-temple-id',
          name: 'some-name',
          url: 'some-url',
          active: false,
        },
        {
          id: 'some-other-temple-id',
          name: 'some-other-name',
          url: 'some-other-url',
          active: true,
        },
      ],
    },
  },
  {includeIdsInData: true},
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
        },
        {
          active: true,
          id: 'some-other-temple-id',
          name: 'some-other-name',
          url: 'some-other-url',
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
});

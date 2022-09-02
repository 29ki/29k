import request from 'supertest';
import Router from '@koa/router';
import {mockFirebase} from 'firestore-jest-mock';

mockFirebase(
  {
    database: {
      temples: [
        {
          id: 'some-temple-id',
          active: false,
          name: 'some-name',
          url: 'some-url',
          index: 0,
          playing: false,
        },
        {
          id: 'some-other-temple-id',
          active: false,
          name: 'some-other-name',
          url: 'some-other-url',
          index: 0,
          playing: false,
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
import {mockUpdate} from 'firestore-jest-mock/mocks/firestore';

jest.mock('../../lib/dailyApi', () => mockDailyApi);

const router = new Router();
router.use('/temples', templesRouter.routes());
const mockServer = createMockServer(router.routes(), router.allowedMethods());

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
          active: false,
          name: 'some-name',
          url: 'some-url',
          index: 0,
          playing: false,
        },
        {
          id: 'some-other-temple-id',
          active: false,
          name: 'some-other-name',
          url: 'some-other-url',
          index: 0,
          playing: false,
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
        playing: false,
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

  describe('PUT /:id', () => {
    it('should update index', async () => {
      const response = await request(mockServer)
        .put(`/temples/some-temple-id`)
        .send({index: 2})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        active: false,
        id: 'some-temple-id',
        index: 2,
        name: 'some-name',
        url: 'some-url',
        playing: false,
      });
    });

    it('should update active', async () => {
      const response = await request(mockServer)
        .put(`/temples/some-other-temple-id`)
        .send({active: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        active: true,
        id: 'some-other-temple-id',
        index: 0,
        name: 'some-other-name',
        url: 'some-other-url',
        playing: false,
      });
    });

    it('should update playing', async () => {
      const response = await request(mockServer)
        .put(`/temples/some-other-temple-id`)
        .send({playing: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        active: true,
        id: 'some-other-temple-id',
        index: 0,
        name: 'some-other-name',
        url: 'some-other-url',
        playing: true,
      });
    });

    it('should require a field', async () => {
      const response = await request(mockServer)
        .put(`/temples/some-temple-id`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
      expect(mockUpdate).toHaveBeenCalledTimes(0);
    });

    it('does not accept other fields', async () => {
      const response = await request(mockServer)
        .put(`/temples/some-temple-id`)
        .send({active: true, index: 1, foo: 'bar'})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toBeCalledWith({active: true, index: 1});
    });

    it('should return 500 on non-existing temple', async () => {
      const response = await request(mockServer)
        .put(`/temples/some-non-existing-id`)
        .send({active: true, index: 1})
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
      expect(mockUpdate).toHaveBeenCalledTimes(0);
    });
  });
});

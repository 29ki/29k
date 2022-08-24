import Koa from 'koa';
import Router from '@koa/router';
import request from 'supertest';
import {mockFirebase} from 'firestore-jest-mock';
import bodyParser from 'koa-bodyparser';

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

import i18nResolver from '../lib/i18nResolver';
import {templesRouter} from '.';

jest.mock('../../lib/dailyApi', () => mockDailyApi);

describe('/api/temples', () => {
  const app = new Koa();
  const router = new Router();

  router.use('/temples', templesRouter.routes());
  app.use(bodyParser());
  app.use(i18nResolver());
  app.use(router.routes());
  app.use(router.allowedMethods());

  it('GET', async () => {
    const response = await request(app.listen()).get('/temples');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {active: false, id: 'some-temple-id', name: 'some-name', url: 'some-url'},
      {
        active: true,
        id: 'some-other-temple-id',
        name: 'some-other-name',
        url: 'some-other-url',
      },
    ]);
  });

  it('POST', async () => {
    const response = await request(app.listen())
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
});

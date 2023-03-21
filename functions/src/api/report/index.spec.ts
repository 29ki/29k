import request from 'supertest';
import Koa from 'koa';

import {reportRouter} from '.';
import createMockServer from '../lib/createMockServer';
import {createApiRouter} from '../../lib/routers';

import * as reportController from '../../controllers/report';

jest.mock('../../controllers/report');
const mockCreateReport = jest.mocked(reportController.createReport);

const router = createApiRouter();
router.use('/report', reportRouter.routes());
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

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockServer.close();
});

describe('/api/report', () => {
  describe('POST', () => {
    it('should create a report with proper language tag', async () => {
      const response = await request(mockServer)
        .post('/report')
        .send({
          text: 'some text',
          params: {},
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
      expect(mockCreateReport).toHaveBeenCalledTimes(1);
      expect(mockCreateReport).toHaveBeenCalledWith({
        language: 'en',
        params: {},
        text: 'some text',
      });
    });

    it('should fail without proper text', async () => {
      const response = await request(mockServer)
        .post('/report')
        .send({})
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Internal Server Error');
      expect(mockCreateReport).toHaveBeenCalledTimes(0);
    });
  });
});

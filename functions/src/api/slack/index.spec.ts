import request from 'supertest';
import Koa from 'koa';
import {slackRouter} from '.';
import createMockServer from '../lib/createMockServer';
import {cerateSlackRouter} from '../../lib/routers';

import {publicHostAction} from '../../controllers/slack';

jest.mock('../../controllers/slack');
const mockPublicHostAction = publicHostAction as jest.Mock;

const router = cerateSlackRouter();
router.use('/slack', slackRouter.routes());
const mockServer = createMockServer(
  async (ctx: Koa.Context, next: Koa.Next) => {
    await next();
  },
  router.routes(),
  router.allowedMethods(),
);

beforeEach(async () => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockServer.close();
});

describe('/slack', () => {
  describe('/publicHostAction', () => {
    it('should call controller', async () => {
      const response = await request(mockServer)
        .post('/slack/publicHostAction')
        .send({payload: {}});

      expect(mockPublicHostAction).toHaveBeenCalledWith({});
      expect(response.status).toBe(200);
    });

    it('should fail when controller fails', async () => {
      mockPublicHostAction.mockRejectedValueOnce({error: 'error'});
      const response = await request(mockServer)
        .post('/slack/publicHostAction')
        .send({payload: {}});

      expect(mockPublicHostAction).toHaveBeenCalledWith({});
      expect(response.status).toBe(500);
    });
  });
});

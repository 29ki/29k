import request from 'supertest';
import Koa from 'koa';
import {slackRouter} from '.';
import createMockServer from '../../api/lib/createMockServer';
import {cerateSlackRouter} from '../../lib/routers';
import {slackHandler} from '../controllers/slack';
import {SlackContext} from '../lib/verifySlackRequest';

jest.mock('../controllers/slack');
const mockPublicHostAction = slackHandler as jest.Mock;

const router = cerateSlackRouter();
router.use('/slack', slackRouter.routes());
const mockServer = createMockServer(
  async (ctx: SlackContext, next: Koa.Next) => {
    ctx.req.body = ctx.request.body as Record<string, unknown>;
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
  describe('/', () => {
    it('should call controller', async () => {
      const response = await request(mockServer)
        .post('/slack')
        .send({payload: {}});

      expect(mockPublicHostAction).toHaveBeenCalledWith({});
      expect(response.status).toBe(200);
    });

    it('should fail when controller fails', async () => {
      mockPublicHostAction.mockRejectedValueOnce({error: 'error'});
      const response = await request(mockServer)
        .post('/slack')
        .send({payload: {}});

      expect(mockPublicHostAction).toHaveBeenCalledWith({});
      expect(response.status).toBe(500);
    });
  });
});

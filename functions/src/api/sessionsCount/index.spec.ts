import request from 'supertest';
import Koa from 'koa';

import {sessionsCountRouter} from '.';
import {createApiRouter} from '../../lib/routers';
import createMockServer from '../lib/createMockServer';
import * as sessionsController from '../../controllers/sessions';
import {CompletedSessionsCount} from '../../../../shared/src/types/CompletedSessions';

jest.mock('../../controllers/sessions');

const mockGetCompletedSessionsCount = jest.mocked(
  sessionsController.getCompletedSessionsCount,
);

const getMockCustomClaims = jest.fn();
const router = createApiRouter();
router.use('/completedSessionsCount', sessionsCountRouter.routes());
const mockServer = createMockServer(
  async (ctx: Koa.Context, next: Koa.Next) => {
    ctx.user = {
      id: 'some-user-id',
      customClaims: getMockCustomClaims(),
    };
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

describe('/completedSessionsCount', () => {
  it('should return completed sessions count', async () => {
    mockGetCompletedSessionsCount.mockResolvedValueOnce([
      {
        exerciseId: 'some-exercise-id',
        publicCount: 1,
      } as CompletedSessionsCount,
    ]);

    const response = await request(mockServer).get('/completedSessionsCount');

    expect(mockGetCompletedSessionsCount).toHaveBeenCalledTimes(1);
    expect(response.status).toEqual(200);
    expect(response.headers).toMatchObject({'cache-control': 'max-age=1800'});
    expect(response.body).toEqual([
      {
        exerciseId: 'some-exercise-id',
        publicCount: 1,
      },
    ]);
  });
});

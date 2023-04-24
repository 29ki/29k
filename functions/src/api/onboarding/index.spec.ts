import request from 'supertest';

import {onboardingRouter} from '.';
import createMockServer from '../lib/createMockServer';
import {createApiPreAuthRouter} from '../../lib/routers';

import * as sessionsController from '../../controllers/sessions';
import {LiveSessionModel} from '../../controllers/types/types';

jest.mock('../../controllers/sessions');
const mockGetUpcomingPublicSessions = jest.mocked(
  sessionsController.getUpcomingPublicSessions,
);

const router = createApiPreAuthRouter();
router.use('/onboarding', onboardingRouter.routes());
const mockServer = createMockServer(router.routes(), router.allowedMethods());

beforeEach(async () => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockServer.close();
});

describe('/api/onboarding', () => {
  describe('GET /sessions', () => {
    it('should return sessions', async () => {
      mockGetUpcomingPublicSessions.mockResolvedValueOnce([
        {
          id: 'some-session-id',
        },
        {
          id: 'some-other-session-id',
        },
      ] as LiveSessionModel[]);
      const response = await request(mockServer).get('/onboarding/sessions');

      expect(mockGetUpcomingPublicSessions).toHaveBeenCalledTimes(1);
      expect(mockGetUpcomingPublicSessions).toHaveBeenCalledWith(undefined);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 'some-session-id',
        },
        {
          id: 'some-other-session-id',
        },
      ]);
    });

    it('supports limiting the results', async () => {
      mockGetUpcomingPublicSessions.mockResolvedValueOnce([]);
      await request(mockServer).get('/onboarding/sessions?limit=4');

      expect(mockGetUpcomingPublicSessions).toHaveBeenCalledTimes(1);
      expect(mockGetUpcomingPublicSessions).toHaveBeenCalledWith(4);
    });
  });
});

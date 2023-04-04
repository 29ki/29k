import request from 'supertest';

import {onboardingRouter} from '.';
import createMockServer from '../lib/createMockServer';
import {createApiAuthRouter} from '../../lib/routers';

import * as sessionsController from '../../controllers/sessions';
import {LiveSession} from '../../../../shared/src/types/Session';

jest.mock('../../controllers/sessions');
const mockGetUpcomingPublicSessions = jest.mocked(
  sessionsController.getUpcomingPublicSessions,
);

const router = createApiAuthRouter();
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
      ] as LiveSession[]);
      const response = await request(mockServer).get('/onboarding/sessions');

      expect(mockGetUpcomingPublicSessions).toHaveBeenCalledTimes(1);
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
  });
});

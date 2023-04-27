import request from 'supertest';
import {Timestamp} from 'firebase-admin/firestore';

import {onboardingRouter} from '.';
import createMockServer from '../lib/createMockServer';
import {createApiPreAuthRouter} from '../../lib/routers';

import * as sessionsController from '../../controllers/sessions';
import {LiveSessionModel} from '../../controllers/types/types';
import {SessionMode, SessionType} from '../../../../shared/src/schemas/Session';

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

const createMockSession = (id: string): LiveSessionModel => {
  return {
    id,
    hostId: 'some-host-id',
    type: SessionType.public,
    mode: SessionMode.live,
    exerciseId: 'some-exercise-id',
    startTime: Timestamp.now(),
    closingTime: Timestamp.now(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    ended: false,
    dailyRoomName: 'some-room-id',
    url: 'some-url',
    interestedCount: 0,
    inviteCode: 123456,
    userIds: ['*'],
    language: 'en',
    hostProfile: {
      uid: 'some-host-id',
    },
  };
};

describe('/api/onboarding', () => {
  describe('GET /sessions', () => {
    it('should return sessions', async () => {
      mockGetUpcomingPublicSessions.mockResolvedValueOnce([
        createMockSession('some-session-id'),
        createMockSession('some-other-session-id'),
      ] as LiveSessionModel[]);
      const response = await request(mockServer).get('/onboarding/sessions');

      expect(mockGetUpcomingPublicSessions).toHaveBeenCalledTimes(1);
      expect(mockGetUpcomingPublicSessions).toHaveBeenCalledWith(undefined);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([
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

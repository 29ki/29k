import request from 'supertest';
import Koa from 'koa';

import {sessionsRouter} from '.';
import createMockServer from '../lib/createMockServer';
import {createApiAuthRouter} from '../../lib/routers';
import {ROLE} from '../../../../shared/src/schemas/User';
import * as sessionsController from '../../controllers/sessions';
import * as feedbackController from '../../controllers/feedback';
import {RequestError} from '../../controllers/errors/RequestError';
import {
  JoinSessionError,
  ValidateSessionError,
} from '../../../../shared/src/errors/Session';
import {SessionMode, SessionType} from '../../../../shared/src/schemas/Session';
import {LiveSessionModel} from '../../controllers/types/types';
import {Timestamp} from 'firebase-admin/firestore';
import {FeedbackInput} from '../../../../shared/src/types/Feedback';

jest.mock('../../controllers/sessions');
jest.mock('../../controllers/feedback');
const mockGetSessionsByUserId =
  sessionsController.getSessionsByUserId as jest.Mock;
const mockCreateSession = sessionsController.createSession as jest.Mock;
const mockRemoveSession = sessionsController.removeSession as jest.Mock;
const mockUpdateSession = sessionsController.updateSession as jest.Mock;
const mockUpdateInterestedCount =
  sessionsController.updateInterestedCount as jest.Mock;
const mockUpdateSessionState =
  sessionsController.updateSessionState as jest.Mock;
const mockJoinSession = sessionsController.joinSession as jest.Mock;
const mockRemoveUser = sessionsController.removeUser as jest.Mock;
const mockGetSessionToken = sessionsController.getSessionToken as jest.Mock;
const mockGetSession = sessionsController.getSession as jest.Mock;
const mockGetSessionByHostingCode =
  sessionsController.getSessionByHostingCode as jest.Mock;
const mockCreateSessionHostingLink =
  sessionsController.createSessionHostingLink as jest.Mock;
const mockUpdateSessionHost = sessionsController.updateSessionHost as jest.Mock;
const mockGetSessionsFeedbackByHostId =
  feedbackController.getSessionsFeedbackByHostId as jest.Mock;
const mockGetFeedbackCountByExercise =
  feedbackController.getFeedbackCountByExercise as jest.Mock;
const mockGetApprovedFeedbackByExercise =
  feedbackController.getApprovedFeedbackByExercise as jest.Mock;

jest.mock('../../models/session');

const getMockCustomClaims = jest.fn();
const router = createApiAuthRouter();
router.use('/sessions', sessionsRouter.routes());
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

const createMockSession = (
  id: string,
  hostId = 'some-host-id',
): LiveSessionModel => {
  return {
    id,
    hostId,
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

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockServer.close();
});

describe('/api/sessions', () => {
  describe('GET /', () => {
    it('should get sessions', async () => {
      mockGetSessionsByUserId.mockResolvedValueOnce([
        createMockSession('some-session-id'),
        createMockSession('some-other-session-id'),
      ]);

      const response = await request(mockServer).get('/sessions');

      expect(mockGetSessionsByUserId).toHaveBeenCalledWith(
        'some-user-id',
        ['en'],
        undefined,
        undefined,
        undefined,
      );
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([
        {
          id: 'some-session-id',
          startTime: expect.any(String),
        },
        {
          id: 'some-other-session-id',
          startTime: expect.any(String),
        },
      ]);
    });

    it('should get sessions by language', async () => {
      mockGetSessionsByUserId.mockResolvedValueOnce([
        createMockSession('some-session-id'),
        createMockSession('some-other-session-id'),
      ]);

      const response = await request(mockServer).get('/sessions?language=sv');

      expect(mockGetSessionsByUserId).toHaveBeenCalledWith(
        'some-user-id',
        ['sv', 'en'],
        undefined,
        undefined,
        undefined,
      );
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([
        {
          id: 'some-session-id',
          exerciseId: 'some-exercise-id',
        },
        {
          id: 'some-other-session-id',
          exerciseId: 'some-exercise-id',
        },
      ]);
    });

    it('should get sessions by exerciseId', async () => {
      mockGetSessionsByUserId.mockResolvedValueOnce([
        createMockSession('some-session-id'),
        createMockSession('some-other-session-id'),
      ]);

      const response = await request(mockServer).get(
        '/sessions?exerciseId=some-exercise-id',
      );

      expect(mockGetSessionsByUserId).toHaveBeenCalledWith(
        'some-user-id',
        ['en'],
        'some-exercise-id',
        undefined,
        undefined,
      );
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([
        {
          id: 'some-session-id',
          exerciseId: 'some-exercise-id',
        },
        {
          id: 'some-other-session-id',
          exerciseId: 'some-exercise-id',
        },
      ]);
    });

    it('should get sessions by hostId', async () => {
      mockGetSessionsByUserId.mockResolvedValueOnce([
        createMockSession('some-session-id-1', 'some-other-user-id'),
        createMockSession('some-session-id-2', 'some-other-user-id'),
      ]);

      const response = await request(mockServer).get(
        '/sessions?hostId=some-other-user-id',
      );

      expect(mockGetSessionsByUserId).toHaveBeenCalledWith(
        'some-user-id',
        ['en'],
        undefined,
        'some-other-user-id',
        undefined,
      );
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([
        {
          id: 'some-session-id-1',
          hostId: 'some-other-user-id',
        },
        {
          id: 'some-session-id-2',
          hostId: 'some-other-user-id',
        },
      ]);
    });

    it('should get a limited number of sessions', async () => {
      mockGetSessionsByUserId.mockResolvedValueOnce([
        createMockSession('some-session-id-1', 'some-other-user-id'),
        createMockSession('some-session-id-2', 'some-other-user-id'),
      ]);

      const response = await request(mockServer).get('/sessions?limit=5');

      expect(mockGetSessionsByUserId).toHaveBeenCalledWith(
        'some-user-id',
        ['en'],
        undefined,
        undefined,
        5,
      );
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([
        {
          id: 'some-session-id-1',
          hostId: 'some-other-user-id',
        },
        {
          id: 'some-session-id-2',
          hostId: 'some-other-user-id',
        },
      ]);
    });

    it('should only pass a limit if valid', async () => {
      mockGetSessionsByUserId.mockResolvedValueOnce([
        createMockSession('some-session-id-1', 'some-other-user-id'),
        createMockSession('some-session-id-2', 'some-other-user-id'),
      ]);

      const response = await request(mockServer).get('/sessions?limit=0');
      expect(mockGetSessionsByUserId).toHaveBeenCalledTimes(0);
      expect(response.status).toBe(500);

      mockGetSessionsByUserId.mockResolvedValueOnce([
        createMockSession('some-session-id-1', 'some-other-user-id'),
        createMockSession('some-session-id-2', 'some-other-user-id'),
      ]);
      const response2 = await request(mockServer).get('/sessions?limit=NaN');
      expect(mockGetSessionsByUserId).toHaveBeenCalledTimes(0);
      expect(response2.status).toBe(500);
    });
  });

  describe('GET /hostFeedback', () => {
    it('should return host feedback', async () => {
      mockGetSessionsFeedbackByHostId.mockResolvedValueOnce([
        {
          id: 'some-id',
          sessionId: 'some-session-id',
          exerciseId: 'some-exercise-id',
          language: 'en',
          question: 'Some question?',
          comment: 'Some feedback comment',
          answer: true,
          completed: true,
          sessionType: SessionType.public,
          sessionMode: SessionMode.live,
          createdAt: Timestamp.fromDate(new Date('2024-10-08T07:24:00.000Z')),
        },
        {
          id: 'some-other-id',
          sessionId: 'some-other-session-id',
          exerciseId: 'some-exercise-id',
          language: 'en',
          question: 'Some other question?',
          comment: 'Some other feedback comment',
          answer: true,
          completed: true,
          sessionType: SessionType.private,
          sessionMode: SessionMode.live,
          createdAt: Timestamp.fromDate(new Date('2024-10-08T07:24:00.000Z')),
        },
      ]);

      const response = await request(mockServer).get(
        '/sessions/hostFeedback?limit=10',
      );

      expect(mockGetSessionsFeedbackByHostId).toHaveBeenCalledTimes(1);
      expect(mockGetSessionsFeedbackByHostId).toHaveBeenCalledWith(
        'some-user-id',
        10,
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([
        {
          id: 'some-id',
          sessionId: 'some-session-id',
          exerciseId: 'some-exercise-id',
          question: 'Some question?',
          comment: 'Some feedback comment',
          answer: true,
          completed: true,
          sessionType: SessionType.public,
          sessionMode: SessionMode.live,
          createdAt: '2024-10-08T07:24:00.000Z',
        },
        {
          id: 'some-other-id',
          sessionId: 'some-other-session-id',
          exerciseId: 'some-exercise-id',
          question: 'Some other question?',
          comment: 'Some other feedback comment',
          answer: true,
          completed: true,
          sessionType: SessionType.private,
          sessionMode: SessionMode.live,
          createdAt: '2024-10-08T07:24:00.000Z',
        },
      ]);
    });

    it('should return 500 if no limit is set', async () => {
      const response = await request(mockServer).get('/sessions/hostFeedback');

      expect(mockGetSessionsFeedbackByHostId).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(500);
    });
  });

  describe('GET /:id', () => {
    it('should return session', async () => {
      mockGetSession.mockResolvedValueOnce(
        createMockSession('some-session-id'),
      );

      const response = await request(mockServer).get(
        '/sessions/some-session-id',
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 'some-session-id',
        url: 'some-url',
        hostId: 'some-host-id',
        startTime: expect.any(String),
      });
    });

    it('should return 404 if session is not found', async () => {
      mockGetSession.mockRejectedValueOnce(
        new RequestError(ValidateSessionError.notFound),
      );

      const response = await request(mockServer).get(
        '/sessions/some-session-id',
      );

      expect(response.status).toBe(404);
      expect(response.text).toEqual(ValidateSessionError.notFound);
    });

    it('should return 403 if user is not part of session', async () => {
      mockGetSession.mockRejectedValueOnce(
        new RequestError(ValidateSessionError.userNotFound),
      );

      const response = await request(mockServer).get(
        '/sessions/some-session-id',
      );

      expect(response.status).toBe(403);
      expect(response.text).toEqual(ValidateSessionError.userNotFound);
    });

    it('should return 401 if user is not authorized', async () => {
      mockGetSession.mockRejectedValueOnce(
        new RequestError(ValidateSessionError.userNotAuthorized),
      );

      const response = await request(mockServer).get(
        '/sessions/some-session-id',
      );

      expect(response.status).toBe(401);
      expect(response.text).toEqual(ValidateSessionError.userNotAuthorized);
    });
  });

  describe('GET /:id/sessionToken', () => {
    it('should return token', async () => {
      mockGetSessionToken.mockResolvedValueOnce('some-token');

      const response = await request(mockServer).get(
        '/sessions/some-session-id/sessionToken',
      );

      expect(response.status).toBe(200);
      expect(response.text).toEqual('some-token');
    });

    it('should return 404 if session is not found', async () => {
      mockGetSessionToken.mockRejectedValueOnce(
        new RequestError(ValidateSessionError.notFound),
      );

      const response = await request(mockServer).get(
        '/sessions/some-session-id/sessionToken',
      );

      expect(response.status).toBe(404);
      expect(response.text).toEqual(ValidateSessionError.notFound);
    });

    it('should return 403 if user is not part of session', async () => {
      mockGetSessionToken.mockRejectedValueOnce(
        new RequestError(ValidateSessionError.userNotFound),
      );

      const response = await request(mockServer).get(
        '/sessions/some-session-id/sessionToken',
      );

      expect(response.status).toBe(403);
      expect(response.text).toEqual(ValidateSessionError.userNotFound);
    });
  });

  describe('POST /:id', () => {
    const startTime = new Date('1994-03-08T07:24:00').toISOString();

    it('should return newly created session', async () => {
      getMockCustomClaims.mockReturnValueOnce({role: ROLE.publicHost});

      mockCreateSession.mockResolvedValueOnce(createMockSession('new-session'));
      const response = await request(mockServer)
        .post('/sessions')
        .send({
          exerciseId: 'some-content-id',
          type: 'public',
          startTime,
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 'new-session',
      });
    });

    it('should require user to be publicHost', async () => {
      getMockCustomClaims.mockReturnValueOnce({role: 'not-public-host'});

      const response = await request(mockServer)
        .post('/sessions')
        .send({
          exerciseId: 'some-content-id',
          type: 'public',
          startTime,
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(401);
    });

    it('should fail without session data', async () => {
      getMockCustomClaims.mockReturnValueOnce({role: ROLE.publicHost});
      const response = await request(mockServer)
        .post('/sessions')
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });

    it('should fail if controller throws', async () => {
      mockCreateSession.mockRejectedValueOnce(
        new Error('some error text') as never,
      );
      const response = await request(mockServer)
        .post('/sessions')
        .send({name: 'the name'});
      expect(response.status).toBe(500);
    });
  });

  describe('PUT /:id', () => {
    it('should return updated session', async () => {
      mockUpdateSession.mockResolvedValueOnce(
        createMockSession('some-session-id'),
      );
      const response = await request(mockServer)
        .put('/sessions/some-session-id')
        .send({type: SessionType.private})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 'some-session-id',
      });
    });

    it('should fail on invalid fields', async () => {
      const response = await request(mockServer)
        .put('/sessions/some-session-id')
        .send({invalidField: 'some-value'})
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
    });

    it('should fail when update rejects', async () => {
      mockUpdateSession.mockRejectedValueOnce(new Error('some-error'));
      const response = await request(mockServer)
        .put('/sessions/some-other-session-id')
        .send({started: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });
  });

  describe('PUT /:id/interestedCount', () => {
    it('should return updated session', async () => {
      const response = await request(mockServer)
        .put('/sessions/some-session-id/interestedCount')
        .send({increment: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(mockUpdateInterestedCount).toHaveBeenCalledWith(
        'some-session-id',
        true,
      );
    });

    it('should fail when update rejects', async () => {
      mockUpdateInterestedCount.mockRejectedValueOnce(new Error('some-error'));
      const response = await request(mockServer)
        .put('/sessions/some-session-id/interestedCount')
        .send({increment: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });
  });

  describe('PUT /:id/state', () => {
    it('should call session update', async () => {
      mockUpdateSessionState.mockResolvedValueOnce({
        id: 'some-session-id',
        completed: false,
        ended: false,
        index: 2,
        playing: false,
        started: true,
        timestamp: Timestamp.now(),
      });
      const response = await request(mockServer)
        .put('/sessions/some-session-id/state')
        .send({index: 2})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'some-session-id',
        completed: false,
        ended: false,
        index: 2,
        playing: false,
        started: true,
        timestamp: expect.any(String),
      });
    });

    it('should fail when update rejects', async () => {
      mockUpdateSessionState.mockRejectedValueOnce(new Error('some-error'));
      const response = await request(mockServer)
        .put('/sessions/some-other-session-id/state')
        .send({playing: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });

    it('should require a field', async () => {
      const response = await request(mockServer)
        .put('/sessions/some-session-id/state')
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
      expect(mockUpdateSessionState).toHaveBeenCalledTimes(0);
    });

    it('does not accept other fields', async () => {
      mockUpdateSessionState.mockResolvedValueOnce({
        id: 'some-session-id',
        completed: false,
        ended: false,
        index: 1,
        playing: false,
        started: true,
        timestamp: Timestamp.now(),
      });
      const response = await request(mockServer)
        .put('/sessions/some-session-id/state')
        .send({index: 1, foo: 'bar'})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(mockUpdateSessionState).toHaveBeenCalledTimes(1);
      expect(mockUpdateSessionState).toHaveBeenCalledWith(
        'some-user-id',
        'some-session-id',
        {
          index: 1,
        },
      );
    });
  });

  describe('PUT /:sessionId/removeMyself', () => {
    it('should remove user', async () => {
      mockRemoveUser.mockResolvedValueOnce({});
      const response = await request(mockServer)
        .put('/sessions/some-session-id/removeMyself')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
    });

    it('should fail when session is not found', async () => {
      mockRemoveUser.mockRejectedValueOnce(
        new RequestError(ValidateSessionError.notFound),
      );

      const response = await request(mockServer)
        .put('/sessions/some-session-id/removeMyself')
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.text).toBe(ValidateSessionError.notFound);
    });
  });

  describe('PUT /joinSession', () => {
    it('should return joined session', async () => {
      mockJoinSession.mockResolvedValueOnce(
        createMockSession('some-session-id'),
      );
      const response = await request(mockServer)
        .put('/sessions/joinSession')
        .send({inviteCode: 12345})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 'some-session-id',
      });
    });

    it('should fail on invalid fields', async () => {
      const response = await request(mockServer)
        .put('/sessions/joinSession')
        .send({invalidField: 12345})
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
    });

    it('should fail when session is not found', async () => {
      mockJoinSession.mockRejectedValueOnce(
        new RequestError(JoinSessionError.notFound),
      );

      const response = await request(mockServer)
        .put('/sessions/joinSession')
        .send({inviteCode: 12345})
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.text).toBe(JoinSessionError.notFound);
    });

    it('should fail when session is no longer available', async () => {
      mockJoinSession.mockRejectedValueOnce(
        new RequestError(JoinSessionError.notAvailable),
      );

      const response = await request(mockServer)
        .put('/sessions/joinSession')
        .send({inviteCode: 12345})
        .set('Accept', 'application/json');

      expect(response.status).toBe(410);
      expect(response.text).toBe(JoinSessionError.notAvailable);
    });
  });

  describe('DELETE', () => {
    it('should delete and confirm on response', async () => {
      mockRemoveSession.mockResolvedValue(undefined);
      const response = await request(mockServer)
        .delete('/sessions/some-session-id')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.text).toEqual('Session deleted successfully');
    });
  });

  describe('GET /hostingCode/:hostingCode', () => {
    it('should return session', async () => {
      getMockCustomClaims.mockReturnValueOnce({role: ROLE.publicHost});
      mockGetSessionByHostingCode.mockResolvedValueOnce(
        createMockSession('some-session-id'),
      );

      const response = await request(mockServer).get(
        '/sessions/hostingCode/123456',
      );

      expect(mockGetSessionByHostingCode).toHaveBeenCalledWith(123456);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 'some-session-id',
      });
    });

    it('should return 404 if session is not found', async () => {
      getMockCustomClaims.mockReturnValueOnce({role: ROLE.publicHost});
      mockGetSessionByHostingCode.mockRejectedValueOnce(
        new RequestError(JoinSessionError.notFound),
      );

      const response = await request(mockServer).get(
        '/sessions/hostingCode/123456',
      );
      expect(response.text).toEqual(JoinSessionError.notFound);
      expect(response.status).toBe(404);
    });

    it('should return 401 if session is not available', async () => {
      getMockCustomClaims.mockReturnValueOnce({role: ROLE.publicHost});
      mockGetSessionByHostingCode.mockRejectedValueOnce(
        new RequestError(JoinSessionError.notAvailable),
      );

      const response = await request(mockServer).get(
        '/sessions/hostingCode/123456',
      );
      expect(response.text).toEqual(JoinSessionError.notAvailable);
      expect(response.status).toBe(410);
    });
  });

  describe('PUT /:id/hostingLink', () => {
    it('should return a hosting invite link', async () => {
      getMockCustomClaims.mockReturnValueOnce({role: ROLE.publicHost});
      mockCreateSessionHostingLink.mockResolvedValue('hosting-link');
      const response = await request(mockServer).put(
        '/sessions/some-session-id/hostingLink',
      );

      expect(response.status).toBe(200);
      expect(mockCreateSessionHostingLink).toHaveBeenCalledWith(
        'some-user-id',
        'some-session-id',
      );
      expect(response.text).toEqual('hosting-link');
    });

    it('should fail when update rejects', async () => {
      getMockCustomClaims.mockReturnValueOnce({role: ROLE.publicHost});
      mockCreateSessionHostingLink.mockRejectedValueOnce(
        new Error('some-error'),
      );
      const response = await request(mockServer).put(
        '/sessions/some-session-id/hostingLink',
      );

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });
  });

  describe('PUT /:id/acceptHostingInvite', () => {
    it('should update session host', async () => {
      getMockCustomClaims.mockReturnValueOnce({role: ROLE.publicHost});
      mockUpdateSessionHost.mockResolvedValue(
        createMockSession('updated-host-session-id'),
      );

      const response = await request(mockServer)
        .put('/sessions/updated-host-session-id/acceptHostingInvite')
        .send({hostingCode: 123456})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(mockUpdateSessionHost).toHaveBeenCalledWith(
        'some-user-id',
        'updated-host-session-id',
        123456,
      );
      expect(response.body).toMatchObject({id: 'updated-host-session-id'});
    });
  });

  describe('GET /exercises/:exerciseId/rating', () => {
    it('should return count', async () => {
      mockGetFeedbackCountByExercise.mockResolvedValueOnce({
        positive: 2,
        negative: 0,
      });

      const response = await request(mockServer).get(
        '/sessions/exercises/1234/rating?mode=live',
      );

      expect(mockGetFeedbackCountByExercise).toHaveBeenCalledWith(
        '1234',
        'live',
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({positive: 2, negative: 0});
    });

    it('should return count', async () => {
      mockGetFeedbackCountByExercise.mockResolvedValueOnce({
        positive: 2,
        negative: 0,
      });

      const response = await request(mockServer).get(
        '/sessions/exercises/1234/rating',
      );

      expect(mockGetFeedbackCountByExercise).toHaveBeenCalledWith(
        '1234',
        undefined,
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({positive: 2, negative: 0});
    });
  });

  describe('GET /exercises/:exerciseId/feedback', () => {
    it('should return latest feedback', async () => {
      mockGetApprovedFeedbackByExercise.mockResolvedValueOnce([
        {
          id: 'some-id',
          exerciseId: 'some-exercise-id',
          sessionId: 'some-session-id',
          sessionMode: 'live',
          sessionType: 'public',
          host: false,
          completed: true,
          approved: true,
          question: 'some question',
          answer: true,
          createdAt: Timestamp.fromDate(new Date('2021-03-08T07:24:00')),
        } as FeedbackInput,
        {
          id: 'some-other-id',
          exerciseId: 'some-exercise-id',
          sessionId: 'some-session-id',
          sessionMode: 'live',
          sessionType: 'public',
          host: false,
          completed: true,
          approved: true,
          question: 'some question',
          answer: true,
          createdAt: Timestamp.fromDate(new Date('2022-03-08T07:24:00')),
        } as FeedbackInput,
      ]);

      const response = await request(mockServer).get(
        '/sessions/exercises/1234/feedback?mode=live&limit=5',
      );

      expect(mockGetApprovedFeedbackByExercise).toHaveBeenCalledTimes(1);
      expect(mockGetApprovedFeedbackByExercise).toHaveBeenCalledWith(
        '1234',
        ['en'],
        'live',
        5,
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 'some-id',
          exerciseId: 'some-exercise-id',
          sessionId: 'some-session-id',
          sessionMode: 'live',
          sessionType: 'public',
          host: false,
          completed: true,
          approved: true,
          question: 'some question',
          answer: true,
          createdAt: '2021-03-08T07:24:00.000Z',
        },
        {
          id: 'some-other-id',
          exerciseId: 'some-exercise-id',
          sessionId: 'some-session-id',
          sessionMode: 'live',
          sessionType: 'public',
          host: false,
          completed: true,
          approved: true,
          question: 'some question',
          answer: true,
          createdAt: '2022-03-08T07:24:00.000Z',
        },
      ]);
    });
  });
});

import request from 'supertest';
import Koa from 'koa';

import {sessionsRouter} from '.';
import createMockServer from '../lib/createMockServer';
import {createApiAuthRouter} from '../../lib/routers';
import {ROLES} from '../../../../shared/src/types/User';
import * as sessionsController from '../../controllers/sessions';
import {RequestError} from '../../controllers/errors/RequestError';
import {
  JoinSessionError,
  ValidateSessionError,
} from '../../../../shared/src/errors/Session';
import {SessionType} from '../../../../shared/src/types/Session';

jest.mock('../../controllers/sessions');
const mockGetSessions = sessionsController.getSessions as jest.Mock;
const mockCreateSession = sessionsController.createSession as jest.Mock;
const mockRemoveSession = sessionsController.removeSession as jest.Mock;
const mockUpdateSession = sessionsController.updateSession as jest.Mock;
const mockUpdateInterestedCount =
  sessionsController.updateInterestedCount as jest.Mock;
const mockUpdateSessionState =
  sessionsController.updateSessionState as jest.Mock;
const mockJoinSession = sessionsController.joinSession as jest.Mock;
const mockGetSessionToken = sessionsController.getSessionToken as jest.Mock;
const mockGetSession = sessionsController.getSession as jest.Mock;

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

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockServer.close();
});

describe('/api/sessions', () => {
  describe('GET', () => {
    it('should get sessions', async () => {
      mockGetSessions.mockResolvedValueOnce([
        {
          id: 'some-session-id',
          name: 'some-name',
          url: 'some-url',
          hostId: 'some-user-id',
          startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
        },
        {
          id: 'some-other-session-id',
          name: 'some-other-name',
          url: 'some-other-url',
          hostId: 'some-other-user-id',
          startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
        },
      ]);

      const response = await request(mockServer).get('/sessions');

      expect(mockGetSessions).toHaveBeenCalledWith('some-user-id', undefined);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 'some-session-id',
          name: 'some-name',
          url: 'some-url',
          hostId: 'some-user-id',
          startTime: expect.any(String),
        },
        {
          id: 'some-other-session-id',
          name: 'some-other-name',
          url: 'some-other-url',
          hostId: 'some-other-user-id',
          startTime: expect.any(String),
        },
      ]);
    });

    it('should get sessions by exerciseId', async () => {
      mockGetSessions.mockResolvedValueOnce([
        {
          id: 'some-session-id',
          name: 'some-name',
          url: 'some-url',
          hostId: 'some-user-id',
          exerciseId: 'some-exercise-id',
          startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
        },
        {
          id: 'some-other-session-id',
          name: 'some-other-name',
          url: 'some-other-url',
          hostId: 'some-other-user-id',
          exerciseId: 'some-exercise-id',
          startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
        },
      ]);

      const response = await request(mockServer).get(
        '/sessions?exerciseId=some-exercise-id',
      );

      expect(mockGetSessions).toHaveBeenCalledWith(
        'some-user-id',
        'some-exercise-id',
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 'some-session-id',
          name: 'some-name',
          url: 'some-url',
          hostId: 'some-user-id',
          exerciseId: 'some-exercise-id',
          startTime: expect.any(String),
        },
        {
          id: 'some-other-session-id',
          name: 'some-other-name',
          url: 'some-other-url',
          hostId: 'some-other-user-id',
          exerciseId: 'some-exercise-id',
          startTime: expect.any(String),
        },
      ]);
    });
  });

  describe('/:id/sessionToken', () => {
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

    describe('/:id', () => {
      it('should return session', async () => {
        mockGetSession.mockResolvedValueOnce({
          id: 'some-session-id',
          name: 'some-name',
          url: 'some-url',
          hostId: 'some-user-id',
          startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
        });

        const response = await request(mockServer).get(
          '/sessions/some-session-id',
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          id: 'some-session-id',
          name: 'some-name',
          url: 'some-url',
          hostId: 'some-user-id',
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
    });
  });

  describe('POST', () => {
    describe('/:id', () => {
      const startTime = new Date('1994-03-08T07:24:00').toISOString();

      it('should return newly created session', async () => {
        getMockCustomClaims.mockReturnValueOnce({role: ROLES.publicHost});

        mockCreateSession.mockResolvedValueOnce({id: 'new-session'});
        const response = await request(mockServer)
          .post('/sessions')
          .send({
            exerciseId: 'some-content-id',
            type: 'public',
            startTime,
          })
          .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
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
        getMockCustomClaims.mockReturnValueOnce({role: ROLES.publicHost});
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
  });

  describe('PUT', () => {
    it('should return updated session', async () => {
      mockUpdateSession.mockResolvedValueOnce({id: 'some-session-id'});
      const response = await request(mockServer)
        .put('/sessions/some-session-id')
        .send({type: SessionType.private})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
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
      mockUpdateSessionState.mockResolvedValueOnce({id: 'some-session-id'});
      const response = await request(mockServer)
        .put('/sessions/some-session-id/state')
        .send({index: 2})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'some-session-id',
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
      mockUpdateSessionState.mockResolvedValueOnce({id: 'some-session-id'});
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

  describe('PUT /joinSession', () => {
    it('should return joined session', async () => {
      mockJoinSession.mockResolvedValueOnce({id: 'some-session-id'});
      const response = await request(mockServer)
        .put('/sessions/joinSession')
        .send({inviteCode: 12345})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
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
});

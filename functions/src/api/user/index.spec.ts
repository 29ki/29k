import request from 'supertest';
import Koa from 'koa';
import {Timestamp} from 'firebase-admin/firestore';
import {getAuth} from 'firebase-admin/auth';
import {mockFirebase} from 'firestore-jest-mock';

mockFirebase({
  database: {
    requests: [],
  },
});

import {userRouter} from '.';
import createMockServer from '../lib/createMockServer';
import {createRouter} from '../../lib/routers';
import {
  getRequstByUserId,
  addRequest,
  removeUsersRequest,
} from '../../models/requests';

jest.mock('../../models/requests');
const mockGetRequestByUserId = getRequstByUserId as jest.Mock;
const mockAddRequest = addRequest as jest.Mock;
const mockRemoveUsersRequest = removeUsersRequest as jest.Mock;

const router = createRouter();
router.use('/user', userRouter.routes());
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

jest.useFakeTimers().setSystemTime(new Date('2022-10-10T09:00:00Z'));

beforeEach(async () => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockServer.close();
});

describe('/api/user', () => {
  describe('/requestPublicHost', () => {
    it('should create a request', async () => {
      (getAuth().getUser as jest.Mock).mockReturnValueOnce({
        email: 'test@test.com',
      });

      const response = await request(mockServer).post(
        '/user/requestPublicHost',
      );

      expect(response.status).toBe(200);
      expect(mockAddRequest).toHaveBeenCalledWith(
        'some-user-id',
        expect.any(Number),
      );
    });

    it('should not create a request when user has no email', async () => {
      (getAuth().getUser as jest.Mock).mockReturnValueOnce({});

      const response = await request(mockServer).post(
        '/user/requestPublicHost',
      );

      expect(response.status).toBe(401);
      expect(mockAddRequest).toHaveBeenCalledTimes(0);
    });

    it('should not create a asecond request when user have already made a request', async () => {
      mockGetRequestByUserId.mockResolvedValueOnce({
        userId: 'some-user-id',
        verificationCode: 123456,
        expires: Timestamp.fromDate(new Date('2022-10-10T10:00:00Z')),
      });
      (getAuth().getUser as jest.Mock).mockReturnValueOnce({
        email: 'test@test.com',
      });

      const response = await request(mockServer).post(
        '/user/requestPublicHost',
      );

      expect(response.status).toBe(409);
      expect(mockAddRequest).toHaveBeenCalledTimes(0);
    });
  });

  describe('/verify', () => {
    it('should upgrade user claims if code is valid', async () => {
      mockGetRequestByUserId.mockResolvedValueOnce({
        userId: 'some-user-id',
        verificationCode: 123456,
        expires: Timestamp.fromDate(new Date('2022-10-10T10:00:00Z')),
      });
      const response = await request(mockServer)
        .put('/user/verify')
        .send({verificationCode: 123456});

      expect(response.status).toBe(200);
      expect(getAuth().setCustomUserClaims as jest.Mock).toHaveBeenCalledWith(
        'some-user-id',
        {
          role: 'publicHost',
        },
      );
      expect(mockRemoveUsersRequest).toHaveBeenCalledWith('some-user-id');
    });

    it('should return 404 if request not found', async () => {
      mockGetRequestByUserId.mockResolvedValueOnce(null);
      const response = await request(mockServer)
        .put('/user/verify')
        .send({verificationCode: 123456});

      expect(response.status).toBe(404);
      expect(getAuth().setCustomUserClaims as jest.Mock).toHaveBeenCalledTimes(
        0,
      );
    });

    it('should return 410 if request has expired', async () => {
      mockGetRequestByUserId.mockResolvedValueOnce({
        userId: 'some-user-id',
        verificationCode: 123456,
        expires: Timestamp.fromDate(new Date('2022-10-10T08:00:00Z')),
      });
      const response = await request(mockServer)
        .put('/user/verify')
        .send({verificationCode: 123456});

      expect(response.status).toBe(410);
      expect(getAuth().setCustomUserClaims as jest.Mock).toHaveBeenCalledTimes(
        0,
      );
    });

    it('should return 404 if verificationCode does not match', async () => {
      mockGetRequestByUserId.mockResolvedValueOnce({
        userId: 'some-user-id',
        verificationCode: 123456,
        expires: Timestamp.fromDate(new Date('2022-10-10T10:00:00Z')),
      });
      const response = await request(mockServer)
        .put('/user/verify')
        .send({verificationCode: 654321});

      expect(response.status).toBe(404);
      expect(getAuth().setCustomUserClaims as jest.Mock).toHaveBeenCalledTimes(
        0,
      );
    });
  });
});

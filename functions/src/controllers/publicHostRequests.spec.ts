import {Timestamp} from 'firebase-admin/firestore';
import {getAuth} from 'firebase-admin/auth';
import {mockFirebase} from 'firestore-jest-mock';

mockFirebase({
  database: {
    requests: [],
  },
});

import {
  getPublicHostRequestByUserId,
  addPublicHostRequest,
  updatePublicHostRequest,
} from '../models/publicHostRequests';
import {
  requestPublicHostRole,
  verifyPublicHostRequest,
} from './publicHostRequests';
import {RequestError} from './errors/RequestError';

jest.mock('../models/publicHostRequests');
const mockGetPublicHostRequestByUserId =
  getPublicHostRequestByUserId as jest.Mock;
const mockAddPublicHostRequest = addPublicHostRequest as jest.Mock;
const mockUpdatePublicHostRequest = updatePublicHostRequest as jest.Mock;

jest.useFakeTimers().setSystemTime(new Date('2022-10-10T09:00:00Z'));

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('requests - conroller', () => {
  describe('requestPublicHostRole', () => {
    it('should create a request', async () => {
      (getAuth().getUser as jest.Mock).mockReturnValueOnce({
        email: 'test@test.com',
      });

      await requestPublicHostRole('some-user-id');

      expect(mockAddPublicHostRequest).toHaveBeenCalledWith('some-user-id');
    });

    it('should not create a request when user has no email', async () => {
      (getAuth().getUser as jest.Mock).mockReturnValueOnce({});

      try {
        await requestPublicHostRole('some-user-id');
      } catch (error) {
        expect(error).toEqual(new RequestError('user-needs-email'));
      }

      expect(mockAddPublicHostRequest).toHaveBeenCalledTimes(0);
    });

    it('should not create a asecond request when user have already made a request', async () => {
      mockGetPublicHostRequestByUserId.mockResolvedValueOnce({
        userId: 'some-user-id',
        verificationCode: 123456,
        expires: Timestamp.fromDate(new Date('2022-10-10T10:00:00Z')),
      });
      (getAuth().getUser as jest.Mock).mockReturnValueOnce({
        email: 'test@test.com',
      });

      try {
        await requestPublicHostRole('some-user-id');
      } catch (error) {
        expect(error).toEqual(new RequestError('request-exists'));
      }

      expect(mockAddPublicHostRequest).toHaveBeenCalledTimes(0);
    });
  });

  describe('verifyRequest', () => {
    it('should upgrade user claims if code is valid', async () => {
      mockGetPublicHostRequestByUserId.mockResolvedValueOnce({
        userId: 'some-user-id',
        verificationCode: 123456,
        status: 'accepted',
      });

      await verifyPublicHostRequest('some-user-id', 123456);

      expect(getAuth().setCustomUserClaims as jest.Mock).toHaveBeenCalledWith(
        'some-user-id',
        {
          role: 'publicHost',
        },
      );
      expect(mockUpdatePublicHostRequest).toHaveBeenCalledWith(
        'some-user-id',
        'verified',
      );
    });

    it('should return 404 if request not found', async () => {
      mockGetPublicHostRequestByUserId.mockResolvedValueOnce(null);

      try {
        await verifyPublicHostRequest('some-user-id', 123456);
      } catch (error) {
        expect(error).toEqual(new RequestError('request-not-found'));
      }

      expect(getAuth().setCustomUserClaims as jest.Mock).toHaveBeenCalledTimes(
        0,
      );
    });

    it('should return 410 if request was declined', async () => {
      mockGetPublicHostRequestByUserId.mockResolvedValueOnce({
        userId: 'some-user-id',
        status: 'declined',
      });

      try {
        await verifyPublicHostRequest('some-user-id', 123456);
      } catch (error) {
        expect(error).toEqual(new RequestError('request-declined'));
      }

      expect(getAuth().setCustomUserClaims as jest.Mock).toHaveBeenCalledTimes(
        0,
      );
    });

    it('should return 404 if verificationCode does not match', async () => {
      mockGetPublicHostRequestByUserId.mockResolvedValueOnce({
        userId: 'some-user-id',
        verificationCode: 123456,
        expires: Timestamp.fromDate(new Date('2022-10-10T10:00:00Z')),
      });

      try {
        await verifyPublicHostRequest('some-user-id', 654321);
      } catch (error) {
        expect(error).toEqual(new RequestError('verification-failed'));
      }

      expect(getAuth().setCustomUserClaims as jest.Mock).toHaveBeenCalledTimes(
        0,
      );
    });
  });
});

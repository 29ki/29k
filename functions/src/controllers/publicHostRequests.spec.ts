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
import {sendPublicHostRequestMessage} from '../models/slack';
import {VerificationError} from '../../../shared/src/errors/User';

jest.mock('../models/publicHostRequests');
jest.mock('../models/slack');

const mockGetPublicHostRequestByUserId =
  getPublicHostRequestByUserId as jest.Mock;
const mockAddPublicHostRequest = addPublicHostRequest as jest.Mock;
const mockUpdatePublicHostRequest = updatePublicHostRequest as jest.Mock;
const mockSendPublicHostRequestMessage =
  sendPublicHostRequestMessage as jest.Mock;

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

      expect(mockAddPublicHostRequest).toHaveBeenCalledTimes(1);
      expect(mockAddPublicHostRequest).toHaveBeenCalledWith('some-user-id');
      expect(mockSendPublicHostRequestMessage).toHaveBeenCalledTimes(1);
      expect(mockSendPublicHostRequestMessage).toHaveBeenCalledWith(
        'some-user-id',
        'test@test.com',
      );
    });

    it('should not create a request when user has no email', async () => {
      (getAuth().getUser as jest.Mock).mockReturnValueOnce({});

      try {
        await requestPublicHostRole('some-user-id');
      } catch (error) {
        expect(error).toEqual(
          new RequestError(VerificationError.userNeedEmail),
        );
      }

      expect(mockAddPublicHostRequest).toHaveBeenCalledTimes(0);
      expect(mockSendPublicHostRequestMessage).toHaveBeenCalledTimes(0);
    });

    it('should not create a asecond request when user have already made a request', async () => {
      mockGetPublicHostRequestByUserId.mockResolvedValueOnce({
        userId: 'some-user-id',
        verificationCode: 123456,
        status: 'accepted',
      });
      (getAuth().getUser as jest.Mock).mockReturnValueOnce({
        email: 'test@test.com',
      });

      try {
        await requestPublicHostRole('some-user-id');
      } catch (error) {
        expect(error).toEqual(
          new RequestError(VerificationError.requestExists),
        );
      }

      expect(mockAddPublicHostRequest).toHaveBeenCalledTimes(0);
      expect(mockSendPublicHostRequestMessage).toHaveBeenCalledTimes(0);
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

    it('should throw error if request was not found', async () => {
      mockGetPublicHostRequestByUserId.mockResolvedValueOnce(null);

      try {
        await verifyPublicHostRequest('some-user-id', 123456);
      } catch (error) {
        expect(error).toEqual(
          new RequestError(VerificationError.requestNotFound),
        );
      }

      expect(getAuth().setCustomUserClaims as jest.Mock).toHaveBeenCalledTimes(
        0,
      );
    });

    it('should not validate requests that where declined', async () => {
      mockGetPublicHostRequestByUserId.mockResolvedValueOnce({
        userId: 'some-user-id',
        status: 'declined',
      });

      try {
        await verifyPublicHostRequest('some-user-id', 123456);
      } catch (error) {
        expect(error).toEqual(
          new RequestError(VerificationError.requestDeclined),
        );
      }

      expect(getAuth().setCustomUserClaims as jest.Mock).toHaveBeenCalledTimes(
        0,
      );
    });

    it('should not validate request that was already used', async () => {
      mockGetPublicHostRequestByUserId.mockResolvedValueOnce({
        userId: 'some-user-id',
        status: 'verified',
      });

      try {
        await verifyPublicHostRequest('some-user-id', 123456);
      } catch (error) {
        expect(error).toEqual(
          new RequestError(VerificationError.verificationAlreadyCalimed),
        );
      }

      expect(getAuth().setCustomUserClaims as jest.Mock).toHaveBeenCalledTimes(
        0,
      );
    });

    it('should throw error indicatint validation failed', async () => {
      mockGetPublicHostRequestByUserId.mockResolvedValueOnce({
        userId: 'some-user-id',
        verificationCode: 123456,
        status: 'accepted',
      });

      try {
        await verifyPublicHostRequest('some-user-id', 654321);
      } catch (error) {
        expect(error).toEqual(
          new RequestError(VerificationError.verificationFailed),
        );
      }

      expect(getAuth().setCustomUserClaims as jest.Mock).toHaveBeenCalledTimes(
        0,
      );
    });
  });
});

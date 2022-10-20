import dayjs from 'dayjs';
import {getAuth} from 'firebase-admin/auth';
import {Timestamp} from 'firebase-admin/firestore';
import {ROLES} from '../../../shared/src/types/User';
import {generateVerificationCode} from '../lib/utils';
import {
  addPublicHostRequest,
  getPublicHostRequestByUserId,
  removePublicHostRequest,
} from '../models/publicHostRequests';
import {RequestError} from './errors/RequestError';

const requestExpired = (timestamp?: Timestamp) =>
  timestamp &&
  dayjs(timestamp.toDate()).isBefore(dayjs(Timestamp.now().toDate()));

export const requestPublicHostRole = async (userId: string) => {
  const user = await getAuth().getUser(userId);

  if (!user.email) {
    throw new RequestError('user-needs-email');
  }

  const request = await getPublicHostRequestByUserId(userId);
  const expired = requestExpired(request?.expires);

  if (request && !expired) {
    throw new RequestError('request-exists');
  }

  await addPublicHostRequest(userId, generateVerificationCode());
};

export const verifyPublicHostRequest = async (
  userId: string,
  verificationCode: number,
) => {
  const request = await getPublicHostRequestByUserId(userId);

  if (!request) {
    throw new RequestError('request-not-found');
  }

  if (requestExpired(request.expires)) {
    throw new RequestError('request-expired');
  }

  if (verificationCode !== request.verificationCode) {
    throw new RequestError('verification-failed');
  }

  await getAuth().setCustomUserClaims(userId, {role: ROLES.publicHost});
  await removePublicHostRequest(userId);
};

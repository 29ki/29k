import dayjs from 'dayjs';
import {getAuth} from 'firebase-admin/auth';
import {Timestamp} from 'firebase-admin/firestore';
import {ROLES} from '../../../shared/src/types/User';
import {generateVerificationCode} from '../lib/utils';
import {
  addRequest,
  getRequstByUserId,
  removeUsersRequest,
} from '../models/requests';
import {RequestError} from './errors/RequestError';

const requestExpired = (timestamp?: Timestamp) =>
  timestamp &&
  dayjs(timestamp.toDate()).isBefore(dayjs(Timestamp.now().toDate()));

export const requestPublicHostRole = async (userId: string) => {
  const user = await getAuth().getUser(userId);

  if (!user.email) {
    throw new RequestError('user-needs-email');
  }

  const request = await getRequstByUserId(userId);
  const expired = requestExpired(request?.expires);

  if (request && !expired) {
    throw new RequestError('request-exists');
  }

  await addRequest(userId, generateVerificationCode());
};

export const verifyRequest = async (
  userId: string,
  verificationCode: number,
) => {
  const request = await getRequstByUserId(userId);

  if (!request) {
    throw new RequestError('request-not-found');
  }

  if (requestExpired(request.expires)) {
    throw new RequestError('request-expired');
  }

  if (verificationCode !== request.verificationCode) {
    console.log('HERE');

    throw new RequestError('verification-failed');
  }

  await getAuth().setCustomUserClaims(userId, {role: ROLES.publicHost});
  await removeUsersRequest(userId);
};

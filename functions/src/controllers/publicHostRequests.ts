import {getAuth} from 'firebase-admin/auth';
import {ROLES} from '../../../shared/src/types/User';
import {sendPublicHostRequestMessage} from '../lib/slack';
import {
  addPublicHostRequest,
  getPublicHostRequestByUserId,
  updatePublicHostRequest,
} from '../models/publicHostRequests';
import {RequestError} from './errors/RequestError';

export const requestPublicHostRole = async (userId: string) => {
  const user = await getAuth().getUser(userId);

  if (!user.email) {
    throw new RequestError('user-needs-email');
  }

  const request = await getPublicHostRequestByUserId(userId);

  if (request) {
    throw new RequestError('request-exists');
  }

  await addPublicHostRequest(userId);
  await sendPublicHostRequestMessage(userId, user.email);
};

export const verifyPublicHostRequest = async (
  userId: string,
  verificationCode: number,
) => {
  const request = await getPublicHostRequestByUserId(userId);

  if (!request) {
    throw new RequestError('request-not-found');
  }

  if (request.status === 'declined') {
    throw new RequestError('request-declined');
  }

  if (request.status === 'verified') {
    throw new RequestError('verification-already-used');
  }

  if (verificationCode !== request.verificationCode) {
    throw new RequestError('verification-failed');
  }

  await getAuth().setCustomUserClaims(userId, {role: ROLES.publicHost});
  await updatePublicHostRequest(userId, 'verified');
};

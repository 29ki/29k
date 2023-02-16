import {getAuth} from 'firebase-admin/auth';
import {VerificationError} from '../../../shared/src/errors/User';
import {ROLES} from '../../../shared/src/types/User';
import {sendPublicHostRequestMessage} from '../models/slack';
import {
  addPublicHostRequest,
  getPublicHostRequestByUserId,
  updatePublicHostRequest,
} from '../models/publicHostRequests';
import {RequestError} from './errors/RequestError';

export const requestPublicHostRole = async (userId: string) => {
  const user = await getAuth().getUser(userId);

  if (!user.email) {
    throw new RequestError(VerificationError.userNeedEmail);
  }

  const request = await getPublicHostRequestByUserId(userId);

  if (request) {
    throw new RequestError(VerificationError.requestExists);
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
    throw new RequestError(VerificationError.requestNotFound);
  }

  if (request.status === 'declined') {
    throw new RequestError(VerificationError.requestDeclined);
  }

  if (request.status === 'verified') {
    throw new RequestError(VerificationError.verificationAlreadyCalimed);
  }

  if (verificationCode !== request.verificationCode) {
    throw new RequestError(VerificationError.verificationFailed);
  }

  await getAuth().setCustomUserClaims(userId, {role: ROLES.publicHost});
  await updatePublicHostRequest(userId, 'verified');
};

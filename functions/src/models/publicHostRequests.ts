import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';
import {getData, removeEmpty} from '../lib/utils';
import {RequestData, RequestStatus} from './types/types';

const REQUESTS_COLLECTION = 'publicHostRequests';

const queryByUserId = async (userId: string) =>
  firestore().collection(REQUESTS_COLLECTION).doc(userId).get();

export const getPublicHostRequestByUserId = async (userId: string) => {
  const snapshot = await queryByUserId(userId);

  return snapshot.exists ? getData<RequestData>(snapshot) : null;
};

export const addPublicHostRequest = async (userId: string) => {
  const now = Timestamp.now();
  const data: RequestData = {
    status: 'requested',
    createdAt: now,
    updatedAt: now,
  };
  await firestore().collection(REQUESTS_COLLECTION).doc(userId).set(data);
};

export const updatePublicHostRequest = async (
  userId: string,
  status: RequestStatus,
  verificationCode?: number,
) => {
  const now = Timestamp.now();

  const data: RequestData = removeEmpty({
    status,
    updatedAt: now,
    verificationCode,
  });

  await firestore()
    .collection(REQUESTS_COLLECTION)
    .doc(userId)
    .set(data, {merge: true});
};

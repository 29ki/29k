import dayjs from 'dayjs';
import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';
import {getData} from '../lib/utils';
import {RequestData} from './types/types';

const REQUESTS_COLLECTION = 'publicHostRequests';

const queryByUserId = async (userId: string) =>
  firestore().collection(REQUESTS_COLLECTION).doc(userId).get();

export const getPublicHostRequestByUserId = async (userId: string) => {
  const snapshot = await queryByUserId(userId);

  return snapshot.exists ? getData<RequestData>(snapshot) : null;
};

export const addPublicHostRequest = async (
  userId: string,
  verificationCode: number,
) => {
  const now = Timestamp.now();
  const data: RequestData = {
    verificationCode,
    expires: Timestamp.fromDate(dayjs(now.toDate()).add(1, 'week').toDate()),
    createdAt: now,
    updatedAt: now,
  };
  await firestore().collection(REQUESTS_COLLECTION).doc(userId).set(data);
};

export const removePublicHostRequest = async (userId: string) => {
  const request = await queryByUserId(userId);
  if (request.exists) {
    await request.ref.delete();
  }
};

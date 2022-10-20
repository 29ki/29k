import dayjs from 'dayjs';
import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';
import {getData} from '../lib/utils';
import {RequestData} from './types/types';

const REQUESTS_COLLECTION = 'requests';

const queryByUserId = async (userId: string) =>
  firestore().collection(REQUESTS_COLLECTION).doc(userId).get();

export const getRequstByUserId = async (userId: string) => {
  const snapshot = await queryByUserId(userId);

  return snapshot.exists ? getData<RequestData>(snapshot) : null;
};

export const addRequest = async (userId: string, verificationCode: number) => {
  const data: RequestData = {
    verificationCode,
    expires: Timestamp.fromDate(
      dayjs(Timestamp.now().toDate()).add(2, 'hours').toDate(),
    ),
  };
  await firestore().collection(REQUESTS_COLLECTION).doc(userId).set(data);
};

export const removeUsersRequest = async (userId: string) => {
  const request = await queryByUserId(userId);
  if (request.exists) {
    await request.ref.delete();
  }
};

import dayjs from 'dayjs';
import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';
import {getData} from '../lib/utils';
import {RequestData} from './types/types';

const REQUESTS_COLLECTION = 'requests';

const queryByUserId = async (userId: string) =>
  firestore()
    .collection(REQUESTS_COLLECTION)
    .where('userId', '==', userId)
    .get();

export const getRequstByUserId = async (userId: string) => {
  const snapshot = await queryByUserId(userId);

  return snapshot.docs.length === 1
    ? getData<RequestData>(snapshot.docs[0])
    : null;
};

export const addRequest = async (userId: string, verificationCode: number) => {
  const data: RequestData = {
    userId,
    verificationCode,
    expires: Timestamp.fromDate(
      dayjs(Timestamp.now().toDate()).add(2, 'hours').toDate(),
    ),
  };
  await firestore().collection(REQUESTS_COLLECTION).add(data);
};

export const removeUsersRequest = async (userId: string) => {
  const requests = await queryByUserId(userId);
  const batch = firestore().batch();
  requests.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
};
